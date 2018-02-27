// vue相关的第三方框架配置地方
import Vue from 'vue'
import $ from 'jquery'
import Axios from 'axios'
import iView from 'iview'
import { Pagination } from 'element-ui'
import 'iview/dist/styles/iview.css'
import 'assets/less/animate.less'

Vue.use(iView)
Vue.use(Pagination)
Vue.prototype.axios = Axios
Vue.prototype.$ = $
