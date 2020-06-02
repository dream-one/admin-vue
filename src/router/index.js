import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import store from '../store/index.js'
import { L1Router, L23Router } from './router.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: login,
    meta: {
      // 页面标题title
      title: '登录'
    }
  },
  { path: '/', redirect: '/login' }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})
// 全局路由守卫 判断是否有token 如果没有则强制跳转登录页
router.beforeEach((to, from, next) => {
  document.title = '人脸识别后台管理系统'
  if (to.path == '/login') {
    return next()
  }
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
    if (store.state.Level == 0) {
      store.dispatch('getUserInfo').then(Level => {
        if (Level == 1) {
          addRouter(L1Router)
        } else {
          addRouter(L23Router)
        }
      })
    } else {
      next()
    }
  
  next()
})

export const addRouter = routes => {
  router.addRoutes(routes)
}
export default router
