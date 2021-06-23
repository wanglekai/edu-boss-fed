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
// 上传图片
export const uploadPic = data => {
  return requset({
    method: 'POST',
    url: '/boss/course/upload',
    data
  })
}
// 通过课程Id获取课程信息
export const getCourseById = courseId => {
  return requset({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: { courseId }
  })
}
// 保存或者更新课程信息
export const saveOrUpdateCourse = data => {
  return requset({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}
