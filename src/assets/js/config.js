// vue相关的第三方框架配置地方
import Vue from 'vue'
import Axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'assets/less/animate.less'

Vue.use(iView)
Vue.prototype.axios = Axios