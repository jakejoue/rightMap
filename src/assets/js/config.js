// vue相关的第三方框架配置地方
import Vue from 'vue'
import $ from 'jquery'
import Axios from 'axios'
import iView from 'iview'
import { Pagination } from 'element-ui'
import '../less/iview.less'
import '../less/animate.less'

// 挂载全局变量
global.$ = $
global.axios = Axios

// 引入全局方法
import './golbal'

Vue.use(iView)
Vue.use(Pagination)
