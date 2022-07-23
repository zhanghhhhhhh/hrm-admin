
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'

import store from '@/store'
// vip 白名单 默认所有的都是坏人，这几个是好人
const whiteList = ['/login', '/404']

// 前置路由效果
router.beforeEach((to, from, next) => {
  // 开启进度效果
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      // 这块ajax只会发送一次
      if (!store.state.user.userInfo.if) {
        // 当用户手里面有token并且访问的不是登录页面，那就应该请求个人资料
        store.dispatch('user/getInfo')
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach(() => {
  // 结束进度效果
  NProgress.done()
})
