<!-- layout/components/AppHeader.vue -->
<template>
  <div class="app-header">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for='(item,index) in breadList'
        :key='index'
        @click.native="breadcrumbClick(item)"
        style="cursor: pointer">
        <span v-if='item.name'>{{item.title}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <!-- Avatar 头像组件 -->
        <el-avatar
        :size="30"
        :src="user.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ user.userName }}</el-dropdown-item>
        <el-dropdown-item @click.native="logout" divided>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/services/user'

export default {
  name: 'AppHeader',
  data () {
    return {
      user: {},
      currentTitle: '',
      breadList: []
    }
  },
  created () {
    this.loadUserInfo()
    this.getBreadcrumb()
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    // 获取用户信息
    async loadUserInfo () {
      const { data } = await getUserInfo()
      if (data.state === 1) {
        this.user = data.content
      }
    },
    breadcrumbClick (item) {
      this.$router.push({
        path: item.path
      })
    },
    // 退出登录
    logout () {
      this.$confirm('确定是否退出?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 退出登录后 清除用户登录信息
        this.$store.commit('setUser', null)
        // 退出登录后需要跳转到 登录页
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        console.log('cancel logout')
      })
    },
    // 面包屑数据处理
    getBreadcrumb () {
      var that = this
      // 由于本项目大部分属于‘一级’页面，所以在设置路由时候，一级页面不设置breadNumber = 1，‘二级’页面以上才设置breadNumber
      var breadNumber = typeof (this.$route.meta.breadNumber) !== 'undefined' ? this.$route.meta.breadNumber : 1
      // 获取当前页面的名字和路由，并组合成新的对象
      var newBread = { name: this.$route.name, path: this.$route.fullPath, title: this.$route.meta.title }
      var vuexBreadList = [] // 默认初始化面包屑数据
      if (breadNumber !== 1) {
        // 当前面包屑breadNumber大于1时才会从vuex中获取值
        vuexBreadList = that.$store.state.breadListState // 获取breadList数组
      }
      if (breadNumber < vuexBreadList.length) {
        // "回退"面包屑----判断条件：当前路由breadNumber小于vuexBreadList的长度
        vuexBreadList.splice(breadNumber - vuexBreadList.length, vuexBreadList.length - breadNumber)
      }
      if (breadNumber > vuexBreadList.length) {
        // 添加面包屑----判断条件：当前路由breadNumber大于vuexBreadList的长度
        vuexBreadList.push(newBread)
      }
      // 处理完数据后，将最终的数据更新到vuex（用于页面刷新）
      that.$store.commit('breadListMutations', vuexBreadList)
      // 处理完数据后，将最终的数据更新为新的面包屑数组
      that.breadList = vuexBreadList
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
