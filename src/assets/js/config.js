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
