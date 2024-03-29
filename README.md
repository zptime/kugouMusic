# 仿酷狗音乐
> 使用技术是react，typescripts，redux

## V1.2 仿酷狗音乐实例实现

* [react-kugou](https://github.com/maoyeyang/react-kugou)
* [react-kugou-demo](https://github.com/aasailan/react-kugou-demo)

## 1.2.1 redux

* redux代码重构：redux相关代码移入redux文件夹
* [sass添加(webpack.config.dev.js)](https://juejin.im/post/5b5d5c5bf265da0f8e19f99b)
* React项目使用vw适配移动端(webpack.config.dev.js)
  * [juejin.im](https://juejin.im/post/5ad56aad51882532ce65affa)
  * [dmmylove.cn](http://dmmylove.cn/articles/40)
* components/Header组件实现
* [@material-ui/core/Tabs和react-router-dom路由结合使用](https://codesandbox.io/s/l4yo482pll)

## 1.2.2 轮播组件

* components/Swiper轮播组件实现
* components/SongList、SongItem 新歌列表组件实现
* 接口配置(src/api)，代理配置(scripts/start.js)
* 并列定义className,参考SongItem组件

## 1.2.3 Tab页

* page/Tab/Rank 排行列表页
* page/Tab/SongList 歌单列表页
* page/Tab/Singer 歌手分类列表页
* page/SingerList 歌手列表页

## 1.2.4 详情页

* [page/SingerInfo 歌手信息页面](https://my.oschina.net/qiaotoubao/blog/3066608)

```` js
// 功能：获取路由参数
import { RouteComponentProps } from "react-router-dom"
interface IRouteParams {
  singerId: string; // 此处必须定义
}

// type Props = RouteComponentProps<{id: string}>;<br>
// 我们需要获取有关当前路径的信息，所以将Props声明为RouteComponentProps的一个“特例”，类型参数{id: string}表明我们希望从路径中取得一个名叫id类型为string的参数。要指出的是，当我们像这样写定一个组件的props的类型为一种RouteComponentProps时，一般来说，这个组件就只能用在Route匹配规则里面了。
interface IProps extends RouteComponentProps<IRouteParams> {
  singerInfo: ISingerInfo
}
const { match: { params: { singerId } }} = this.props
this.props.match.params.singerId
````

* page/RankInfo 排行信息页
* page/SongListInfo 歌单信息页

## 1.2.5 异步组件

* redux相关文件改造
* [utils/asyncComponent.tsx 异步组件](http://www.wukai.me/2017/09/25/react-router-v4-code-splitting/)
* components/HeaderBar组件更新，mapStateToProps实现

## 1.2.6 头部导航更新

* material-ui tab更新，头部导航完善
采用如下方式，报错：Import declaration conflicts with local declaration of 'Tab'(导入声明与“Tab”的本地声明冲突。)
`<Tab label="新歌" component={Link} to="/tab/newsong"/>`

* 相关info页面的头部配置（返回，title）

## 1.2.7 enter事件

* input输入框的enter事件（page/Tab/Search）
* [react学习](https://www.kancloud.cn/tjs5945111/react/980496)

## 1.2.8 音乐播放组件

* components/Player组件
* babel-plugin-react-css-modules使用
安装依赖后报错：Module build failed: Error: Requires Babel "^7.0.0-0", but was loaded with "6.26.3". If you are sure you have a compatible version of @babel/core, it is likely that something in your build process is loading the wrong version. Inspect the stack trace of this error to look for the first entry that doesn't mention "@babel/core" or "babel-core" to see what is calling Babel.

"@babel/plugin-syntax-dynamic-import": "^7.2.0"：has unmet peer dependency "@babel/core@^7.0.0-0"

"@babel/plugin-transform-react-jsx": "^7.3.0"：has unmet peer dependency "@babel/core@^7.0.0-0"
