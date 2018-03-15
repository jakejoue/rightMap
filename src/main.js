// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
import 'assets/js/config'

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
global.root = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store,
  // router
})
