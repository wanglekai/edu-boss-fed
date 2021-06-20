// utils/request.js
// 引入 axios
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import qs from 'qs'
// axios.create() 可以使用自定义配置新建一个 axios 实例
const request = axios.create({})

// 封装 URL 基地址检测函数
function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}
// 设置请求拦截器
request.interceptors.request.use(function (config) {
  // 根据请求的 URL 判断基地址，设置给 config.baseURL
  config.baseURL = getBaseURL(config.url)
  // 配置 token
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

// 重定向到 login
function redirectLogin () {
  store.commit('setUser', null)
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
// 避免多次发生 refresh token 请求
let isRefreshing = false
// 存储因等待 token 刷新而 挂起的请求
let requests = []

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // console.dir(error)
  if (error.response) {
    // 请求发送成功，也收到了响应，到状态码超过了2xx（常见错误处理位置）
    //  保存状态码
    const { status } = error.response
    let errorMessage = ''

    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      /**
       * 1. 没有 token
       * 2. token 无效
       * 3. token 过期
       */
      if (!store.state.user) {
        // 检查当前是否有登录的用户
        router.push({
          name: 'login',
          query: {
            // router.currentRoute 获取当前路由信息对象
            redirect: router.currentRoute.fullPath
          }
        })
        return Promise.reject(error)
      }
      // 将发送的请求 保存到函数中，存储到 requests 中 等待执行，并return 终止操作
      if (isRefreshing) {
        return requests.push(() => {
          request(error.config)
        })
      }
      isRefreshing = true
      //  根据 refresh_token 请求新的 access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        if (res.data.state !== 1) {
          redirectLogin()
          return Promise.reject(error)
        }
        store.commit('setUser', res.data.content)
        // token 刷新后 需要 将 requests 中的请求重新发送
        requests.forEach(callback => callback())
        // 执行完成后 清空数组
        requests = []
        return request(error.config)
      }).catch(() => {
        redirectLogin()
        return Promise.reject(error)
      }).finally(() => {
        // 不关心请求结果，只要请求完成 就更改为 false
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但没有收到响应
    Message.error('请求超时，请重试')
  } else {
    // 在设置请求时发生了一些失去，触发了错误（未知型错误）
    Message.error(`请求失败${error.message}`)
  }
  return Promise.reject(error)
})

export default request
