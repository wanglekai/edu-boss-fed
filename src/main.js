import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 全局注册一个 日期过滤器
Vue.filter('dateFormat', date => {
  date = new Date(date)
  var year = date.getFullYear()
  var month = addZero(date.getMonth() + 1)
  var day = addZero(date.getDate())

  var hours = addZero(date.getHours())
  var minutes = addZero(date.getMinutes())
  var seconds = addZero(date.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

function addZero (num) {
  return num < 10 ? '0' + num : num
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
