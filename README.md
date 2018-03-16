```
整体是基于vue的一个地图应用

整体是控件采用了iveiw的ui库
动画使用vue2-animate库

因为分页控件的样式问题
额外使用了element-ui的分页控件

引入了jquery库是用于一些dom元素的样式获取，以及一些实用的方法
没有直接使用jquery进行dom操作

后台请求采用axios基于promise

引入xml2js框架进行后台xml结果转json格式

KMap.InfoTemplate是js字符串模板，用于在地图上打开弹窗，此处存在js字符串模板和vue模板混用问题

轨迹播放的时间控件是My97DataPicker，地图弹框关闭和打开都会进行dom销毁重绘，控件的初始化在弹窗的show事件里面，暂时不存在框架冲突（避免使用窗体的类名和id）
```

```
npm start 启动
npm run build 打包
```