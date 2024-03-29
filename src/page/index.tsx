/*
 * TODO: 改成使用HOC的方式
 */
import { NetworkError } from '@/api/networkError';
import networkErrorPng from '@/assets/imgs/network_error.png';
import unknowErrorPng from '@/assets/imgs/unknow_error.png';
import ErrorHint, { IProps as ErrorHintProps } from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface IError extends ErrorHintProps {
  error: Error;
}

interface IState<D = any> {
  error: IError | null;
  data: D;
}

// 被包装后的组件 props
export interface IPageComponentProps<D = any, P = any, C =any, S = any> extends IState<D>,
  RouteComponentProps<P, C, S> {
  updateError: (e: Error) => void;
  updateData: (data: D) => void;
}


// HOC，管理page组件的加载页面、错误页面、点击重新加载或者返回到首页
export function pageWrapperGenerator(component: React.ComponentClass,
  LoadingComponent: React.FunctionComponent<any> = Loading) {

  const Component = component as React.ComponentClass<IPageComponentProps>;

  class PageWrapper extends React.PureComponent<RouteComponentProps, IState> {
    public state: IState = {
      data: null,
      error: null,
    }

    constructor(props: RouteComponentProps) {
      super(props);
      // 根据url为key，获取缓存数据
      const { location: { pathname } } = this.props;
      let data: any = localStorage.getItem(pathname);
      if (data) {
        data = JSON.parse(data);
        this.state.data = data;
      }
    }

     // 错误处理
    public updateError = (e: Error) => {
      if (e instanceof NetworkError) {

        if (e.type === NetworkError.ERROR_TYPE.USER_CANCEL) {
          // 用户主动取消，不做任何响应
          return;
        }

        // 网络错误
        this.setState({
          error: {
            clickHandler: this.clearError,
            error: e,
            img: networkErrorPng,
            title: '网络出错啦，点击重新加载',
          }
        });
      } else {
        // 未知错误
        this.setState({
          error: {
            clickHandler: this.toIndex,
            error: e,
            img: unknowErrorPng,
            title: '似乎出了点问题，点击返回首页',
          }
        })
      }
    }

    public clearError = () => {
      this.setState({
        error: null
      });
    }

    public toIndex = () => {
      const { history } = this.props;
      history.replace({
        pathname: '/tab/newSong'
      });
    }

    public updateData = (nextData: any) => {
      const preData = this.state.data;
      this.setState({
        data: {
          ...preData,
          ...nextData
        }
      });
    }

    public componentWillUnmount() {
      const { location: { pathname } } = this.props;
      try {
        localStorage.setItem(pathname, JSON.stringify(this.state.data));
      } catch (e) {
        console.error(e);
      }
    }

    public render() {
      const { data, error } = this.state
      // 没有数据，也没有error，显示加载页面
      if (!data && !error) {
        return (
          <Component {...this.props} {...this.state} updateData={this.updateData}
            updateError={this.updateError}>
            <LoadingComponent/>
            { /* LoadingComponent 会作为props.children传入Component */}
          </Component>
        )
      }

      // 没有数据，有error，显示错误页面
      if (!data && error) {
        return <ErrorHint clickHandler={error.clickHandler} title={error.title} img={error.img}/>
      }

      // 数据渲染
      return <Component {...this.props} {...this.state} updateData={this.updateData} updateError={this.updateError}/>
    }
  }
  return withRouter(PageWrapper);
}
