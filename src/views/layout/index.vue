<template>
  <el-container>
    <app-aside :class="{'open-all': !isCollapse}" :isCollapse="isCollapse" />
    <el-container>
      <el-header style="height: 56px;">
        <el-button
          :class="['collapse-btn', currentIcon]"
          @click="onClick">
        </el-button>
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
  data () {
    return {
      isCollapse: false
    }
  },
  components: {
    AppAside,
    AppHeader
  },
  computed: {
    currentIcon () {
      return this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    }
  },
  methods: {
    onClick () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="scss" scoped>
  .open-all {
    width: 200px;
  }
  .el-container {
    height: 100vh;
    min-width: 980px;
  }
  .el-aside {
    background-color: #d3dce6;
  }

  .el-header {
    position: relative;
    background-color:#fff;
    .collapse-btn {
      width: 56px;
      height: 56px;
      font-size: 20px;
      position: absolute;
      left: 0;
      top: 0;
      border: none;
      z-index: 99;
      &:focus {
        background-color: #fff;
      }
    }
    .app-header {
      margin-left: 40px;
    }
  }

  .el-main {
    background-color: #e9eef3;
  }
</style>
