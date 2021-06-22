import request from '../utils/request'
import qs from 'qs'

// 用户登录接口请求
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // header 可省略，qs.stringify() 会自动设置
    data: qs.stringify(data)
  })
}
// 获取用户信息请求
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
// 分页查询用户信息
export const getUserPages = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}
