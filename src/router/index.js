// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import { Message } from 'element-ui'

/*
  为了进行组件加载优化，应设置 `路由懒加载`
  这时可以使用 import()（mdn 、 vue）来进行模块动态加载，
  模块（和子模块）会分割到单独的 chunk 中；
  方法返回的 Promise 对象设置给 component，
  这种组件只有在被需要时才会被 Vue 执行并渲染。
  通过以上处理，可以优化项目的加载速度。
*/

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    // meta 用于指定当前 路由是否进行检测
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      },
      // 角色菜单管理
      {
        path: '/alloc-menu/:roleId',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/AllocMenu'),
        props: true
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      {
        // 添加菜单
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create')
      },
      {
        // 编辑菜单
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index'),
        children: [
          {
            path: '',
            name: 'course',
            component: () => import(/* webpackChunkName: 'course' */'@/views/course/components/List')
          },
          {
            // 新建课程
            path: 'create',
            name: 'create-course',
            component: () => import(/* webpackChunkName: 'create-course' */'@/views/course/create')
          },
          {
            // 编辑课程
            path: 'edit/:courseId',
            name: 'edit-course',
            component: () => import(/* webpackChunkName: 'edit-course' */'@/views/course/edit'),
            props: true
          }
        ]
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index')
      }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
  }
]

const router = new VueRouter({
  routes
})

/*
 导航守卫：用于检查 待访问路由的权限
 需要已登录的状态 才可以进行访问
 否则跳转到 登录页
*/
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 只要匹配到 meta: { requiresAuth: true } ，则需要验证
    if (store.state.user) return next()
    Message.error('请先登录!')
    // 身份认证-登录后跳转到上次访问的页面
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
