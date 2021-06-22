<!-- 给角色分配菜单 -->
<template>
  <el-card class="box-card alloc-menu">
    <div slot="header" class="clearfix">
      角色分配菜单 —— 用户 id: {{ roleId }}
    </div>
    <el-tree
      :data="menus"
      :props="defaultProps"
      v-loading="loading"
      show-checkbox
      ref="tree"
      default-expand-all
      node-key="id"
      @check="onChecked"></el-tree>
    <el-row class="btn-box">
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button @click="onReset">清除</el-button>
    </el-row>
  </el-card>
</template>
<script>
import {
  getRoleMenus,
  allocateRoleMenus
} from '@/services/menu'

export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      loading: false,
      menus: [],
      checkedKeys: [], // 用户当前选中的项
      defaultProps: {
        label: 'name',
        children: 'subMenuList'
      }
    }
  },
  created () {
    this.loadRoleMenus()
  },
  methods: {
    // 获取角色拥有的菜单列表
    async loadRoleMenus () {
      this.loading = true
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.menus = data.data
        this.filterChecked(this.menus)
        this.$refs.tree.setCheckedKeys(this.checkedKeys)
      } else {
        this.$message.error(data.code + data.mesg)
      }
      this.loading = false
    },
    onSave () {
      this.$confirm('确定是否保存?', '保存提示', {
        type: 'info'
      }).then(async () => {
        // 给角色分配菜单
        const { data } = await allocateRoleMenus({
          roleId: this.roleId,
          menuIdList: this.checkedKeys
        })
        if (data.code === '000000') {
          this.$message.success('save success!')
          this.$router.back()
        }
      }).catch(() => {
        console.info('取消保存')
      })
    },
    onReset () {
      this.checkedKeys = []
      this.$refs.tree.setCheckedKeys([])
    },
    onChecked (itemDate, target) {
      // 当复选框被点击的时候触发
      /**
       * 共两个参数，依次为：
       * 传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，
       * 包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
       */
      this.checkedKeys = target.checkedKeys
    },
    filterChecked (arr) {
      /**
       * 获取 用户菜单后 需要对选中的 子菜单
       * 进行过滤 一个新的数组，
       * 对应的是 tree 组件setCheckedKeys 方法参数 数组
       */
      arr.forEach(item => {
        if (item.selected) {
          // 父节点 选中并且 有子节点的时候 ，需要递归调用
          if (item.subMenuList) {
            this.filterChecked(item.subMenuList)
          } else {
            this.checkedKeys.push(item.id)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.alloc-menu {
  .btn-box {
    display: flex;
    justify-content: center;
  }
}
</style>
