import request from '../utils/request'

// 获取所有菜单项
export const getAllMenu = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}
// 获取编辑菜单页面信息
export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}
// 保存或创建 菜单
export const createMenu = data => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}
// 删除菜单
export const deleteMenu = id => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}
// 获取所有菜单并按层级展示
export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}
// 获取角色拥有的菜单列表
export const getRoleMenus = roleId => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: { roleId }
  })
}
// 给角色分配菜单
export const allocateRoleMenus = data => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}
