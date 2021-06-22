import request from '../utils/request'

// 获取所有角色
export const getAllRole = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}
// 新增或更新角色
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
// 查询用户角色
export const getUserRole = userId => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
// 给用户分配角色
export const allocateUserRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}
