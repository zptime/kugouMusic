/*
 * 歌单信息页面：歌单简介、歌曲列表
 */
import Api from '@/api'
import { ISong } from '@/api/api'
import Drawer from '@/components/Drawer'
import SongList from '@/components/SongList'
import * as React from 'react'
import { RouteComponentProps } from "react-router-dom"
import './songListInfo.scss'

import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { HeaderAction, setHeader } from '@/redux/actions';
import { IHeaderState } from '@/redux/reducers/header';

interface IRouteParams {
  id: string // 此处必须先定义
}

interface IProps extends RouteComponentProps<IRouteParams>, ReturnType<typeof mapDispatchToProps> {
}

// IState用于定义state的属性
interface IState {
  bg: string
  bgdesc: string
  songs: ISong[]
}

class SongListInfo extends React.Component<IProps, IState> {
  private frameId: number | null = null;

  constructor(props: IProps){
    super(props)
    this.state = {
      bg: 'rgba(43, 162, 251, 0)',
      bgdesc: '',
      songs: []
    }
  }

  public async componentDidMount(){
    const { setSongHeader, match: { params: { id } }, location: { state: { title }}} = this.props
    setSongHeader({
      isShow: true,
      title
    })

    const { data: { list: { list: { info: songs }}, info: { list: { imgurl, intro } } } } = await Api.getSongListInfo({ infoId: id })
    this.setState({ bg: imgurl.replace('{size}', '400') })
    this.setState({ bgdesc: intro })
    this.setState({ songs })
  }

  public setHeaderBarStyle: React.UIEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget;
    if (this.frameId === null) {
      this.frameId = window.requestAnimationFrame(() => {
        const { setSongHeader, location: { state: { title }} } = this.props;
        const { scrollTop } = target;
        let opacity;
        if (scrollTop <= 200) {
          opacity = scrollTop / 200;
        } else {
          opacity = 1;
        }
        setSongHeader({
          isShow: true,
          title,
          bg: `rgba(43, 162, 251, ${opacity})`
        });
        this.frameId = null;
      });
    };
  }

  public render(){
    return (
      <div className="page" onScroll={this.setHeaderBarStyle}>
        <div className="song-info__bg" style={{ backgroundImage: `url(${this.state.bg})`}}/>
        <Drawer text={this.state.bgdesc}/>
        <div className="div-line"/>
        <SongList songs={this.state.songs}/>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch: Dispatch<HeaderAction>){
  return {
    setSongHeader(payload: IHeaderState){
      dispatch(setHeader(payload))
    }
  }
}

export default connect(null, mapDispatchToProps)(SongListInfo)
