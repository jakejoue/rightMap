// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Axios from 'axios'
import store from './store'
import router from './router'
import 'assets/less/animate.less'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.axios = Axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store,
  router
})
