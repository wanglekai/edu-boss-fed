import request from '../utils/request'
import qs from 'qs'

export const login = data => {
  // 用户登录接口请求
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // header 可省略，qs.stringify() 会自动设置
    data: qs.stringify(data)
  })
}
