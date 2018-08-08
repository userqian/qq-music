import Vue from 'vue'
import App from './App'
import router from './router'

import 'babel-polyfill'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
// 图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('common/image/loading.jpg'),
  attempt: 1
})

Vue.config.productionTip = false

fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
