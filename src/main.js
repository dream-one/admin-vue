import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts')
// 引入折线图/柱状图等组件
// require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/radar')
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$axios = axios
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
