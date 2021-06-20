<!-- layout/components/AppHeader.vue -->
<template>
  <div class="app-header">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
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
    return { user: {} }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    // 获取用户信息
    async loadUserInfo () {
      const { data } = await getUserInfo()
      if (data.state === 1) {
        this.user = data.content
      }
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
