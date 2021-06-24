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
        component: () => import(/* webpackChunkName: 'home' */'@/views/course/components/List'),
        meta: { title: '' }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index'),
        meta: { title: '角色管理' }
      },
      // 角色菜单管理
      {
        path: '/alloc-menu/:roleId',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/AllocMenu'),
        meta: { title: '角色菜单管理' },
        props: true
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index'),
        meta: { title: '菜单管理', breadNumber: 1 }
      },
      {
        // 添加菜单
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create'),
        meta: { title: '添加菜单', breadNumber: 2 }
      },
      {
        // 编辑菜单
        path: '/menu/edit/:id',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit'),
        meta: { title: '编辑菜单', breadNumber: 2 }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index'),
        meta: { title: '资源管理' }
      },
      {
        path: '/course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index'),
        children: [
          {
            path: '',
            name: 'course',
            component: () => import(/* webpackChunkName: 'course' */'@/views/course/components/List'),
            meta: { title: '课程管理', breadNumber: 1 }
          },
          {
            // 新建课程
            path: 'create',
            name: 'create-course',
            component: () => import(/* webpackChunkName: 'create-course' */'@/views/course/create'),
            meta: { title: '新增课程', breadNumber: 2 }
          },
          {
            // 编辑课程
            path: 'edit/:courseId',
            name: 'edit-course',
            component: () => import(/* webpackChunkName: 'edit-course' */'@/views/course/edit'),
            meta: { title: '编辑课程', breadNumber: 2 },
            props: true
          },
          // 内容管理 - ( 课程结构 )
          {
            path: 'sections/:courseId',
            name: 'course-sections',
            component: () => import(/* webpackChunkName: 'edit-sections' */'@/views/course/section'),
            meta: { title: '课程结构', breadNumber: 2 },
            props: true
          },
          {
            path: 'add-video/:courseId',
            name: 'add-video',
            component: () => import(/* webpackChunkName: 'add-video' */'@/views/course/uploadVideo'),
            meta: { title: '上传视频', breadNumber: 3 },
            props: true
          }
        ]
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index'),
        meta: { title: '用户管理' }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index'),
        meta: { title: '广告管理' }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index'),
        meta: { title: '广告位管理' }
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
