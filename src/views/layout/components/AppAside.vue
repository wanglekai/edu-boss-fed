<!-- /layout/components/AppAside.vue -->
<template>
  <div class="app-aside ">
    <!-- 导航菜单组件 -->
    <el-menu
      default-active="/resource"
      class="el-menu-vertical-demo"
      active-text-color="#666"
      :default-openeds="['1', '4']"
      :collapse="isCollapse"
      router>
      <el-menu-item class="back-to-home" index="/">
        <div title="Back to Home" class="home-title">
          <img
            style="width: 30px;"
            src="http://eduboss.lagou.com/edu-boss-fed/assets/img/logo.e8b9190b.png"
            alt="拉钩教育">
          <h1 v-show="!isCollapse">Edu Boss</h1>
        </div>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-lock"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/role">
          <i class="el-icon-document"></i>
          <span>角色列表</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <i class="el-icon-document"></i>
          <span>菜单列表</span>
        </el-menu-item>
        <el-menu-item index="/resource">
          <i class="el-icon-document"></i>
          <span>资源列表</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/course">
        <i class="el-icon-menu"></i>
        <span slot="title">课程管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">广告管理</span>
        </template>
        <el-menu-item index="/advert">
          <i class="el-icon-document"></i>
          <span>广告列表</span>
        </el-menu-item>
        <el-menu-item index="/advert-space">
          <i class="el-icon-document"></i>
          <span>广告位列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'AppAside',
  props: ['isCollapse']
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}
.app-aside {
  height: 100%;
  .el-menu {
    height: inherit;
    border-right: 0 none;
  }
}
.back-to-home {
  &:focus {
    background-color: #fff;
  }
  .home-title {
    height: 100%;
    display: flex;
    align-items: center;
    h1 {
      margin-left: 10px;
    }
  }
}
</style>
