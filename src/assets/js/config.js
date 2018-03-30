// vue相关的第三方框架配置地方
import Vue from 'vue'
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
Axios.defaults.transformRequest = [function(data, headers) {
  if (headers['Content-Type'] == 'application/x-www-form-urlencoded' && typeof data == 'object') {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    ret = ret.slice(0, -1);
    return ret
  }
  if (headers['Content-Type'] == 'application/json' && (typeof data == 'object' || typeof data == 'array')) {
    return JSON.stringify(data);
  }
  return data;
}]

// 挂载全局变量
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
Message.config({
  duration: 3
})

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
// singleClick(e) 地图单击事件
// resize(height) 地图窗口变更事件(height是街景的百分百高度)
// clearAll() 右上角的清楚按钮的事件
// infoWindow/show(graphic) 窗体打开前事件
// streetView/show(coord) 打开街景
// interface/*(...params) 接口相关事件
global.event = new Vue({
  name: "eventBus"
});
