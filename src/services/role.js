import request from '@/utils/request'

// 获取所有角色
export const getAllRole = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}
// 新增或更新 角色
export const addOrUpdateRole = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}
// 删除 角色
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `boss/role/${id}`
  })
}
// 按条件查询角色
export const getRolePages = data => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}
