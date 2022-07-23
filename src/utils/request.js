import axios from 'axios'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
// vuex和本地存储的区别
// 1.vuex数据是响应式的，实时更新的，而本地存储需要用户手动更新
// 2.速度vuex更快，因为vuex数据在内存中，本地存储在文件中，获取时间慢
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const token = store.state.user.token
  if (token) {
    const time = Date.now() - getTime()
    // 判断token是否有2个小时，如果有则重新登录
    if (time > 7200000) {
      store.dispatch('/user/logout')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('/user/logout')
    router.push('/login')
  }
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const { success, data, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request
