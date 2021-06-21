<template>
  <el-container>
    <el-aside width="200px">
      <app-aside />
    </el-aside>
    <el-container>
      <el-header>
        <!-- 头部组件 -->
        <app-header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>
<style lang="scss" scoped>
  .el-container {
    height: 100vh;
    min-width: 980px;
  }

  .el-aside {
    background-color: #d3dce6;
  }

  .el-header {
    background-color:#fff;
  }

  .el-main {
    background-color: #e9eef3;
  }
</style>
