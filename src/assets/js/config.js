// vue相关的第三方框架配置地方
import Vue from 'vue'
import $ from 'jquery'
import Axios from 'axios'
import {
  Icon,
  Input,
  Button,
  Switch,
  Select,
  Option,
  Checkbox,
  CheckboxGroup,
  Row,
  Col,
  Tree,
  Spin,
  Message
} from 'iview'
import { Pagination } from 'element-ui'
import '../less/iview.less'
import '../less/animate.less'

// 请求时带上cookies
Axios.defaults.withCredentials = true

// 挂载全局变量
global.$ = $
global.axios = Axios

// 引入全局方法
import './golbal'

Vue.component('Icon', Icon)
Vue.component('i-Input', Input)
Vue.component('Button', Button)
Vue.component('i-Switch', Switch)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('Checkbox', Checkbox)
Vue.component('CheckboxGroup', CheckboxGroup)
Vue.component('Row', Row)
Vue.component('i-Col', Col)
Vue.component('Tree', Tree)
Vue.component('Spin', Spin)
Vue.prototype.$Spin = Spin
Vue.prototype.$Message = Message

Vue.component('el-pagination', Pagination)


// 全局loading模态框
Vue.prototype.loading = function(flag = false, html = 'Loading') {
  if (flag) {
    this.$Spin.show({
      render: (h) => {
        return h('div', [
          h('Icon', {
            'class': 'loading',
            props: {
              type: 'load-c',
              size: 50
            }
          }),
          h('div', {
            domProps: {
              innerHTML: html
            },
            style: {
              fontSize: '20px'
            }
          })
        ])
      }
    });
  } else {
    this.$Spin.hide();
  }
}

// 一个eventBus
global.event = new Vue({
  name: "eventBus"
});
