import requset from '../utils/request'

// 分页查询课程信息
export const getQueryCourses = data => {
  return requset({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}
// 课程上下架
export const changeState = params => {
  return requset({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}
