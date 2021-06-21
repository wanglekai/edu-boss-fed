<template>
  <el-card class="box-card role-container">
    <div slot="header" class="clearfix header">
      <h3>筛选搜索</h3>
      <el-form label-width="80px" class="search-role" :model="searchForm" ref="searchForm">
        <el-form-item prop="name" label="角色名称 : ">
          <el-input
            size="small"
            v-model="searchForm.name"
            placeholder="角色名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item prop="description" label="角色描述 : ">
          <el-input
            size="small"
            v-model="searchForm.description"
            placeholder="角色描述"
            clearable></el-input>
        </el-form-item>
        <el-form-item prop="id" label="角色ID : ">
          <el-input
            size="small"
            v-model="searchForm.id"
            placeholder="角色ID"
            clearable></el-input>
        </el-form-item>
        <el-form-item prop="startCreateTime" label="创建时间 : ">
          <el-input
            size="small"
            v-model="searchForm.startCreateTime"
            placeholder="创建时间"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="onResetSearch">重置</el-button>
          <el-button size="small" type="primary" @click="onSearch">搜索查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="add-role">
      <el-button size="small" @click="addRole">添加角色</el-button>
    </el-row>
    <!-- 角色列表 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="description"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        align="center"
        label="添加时间">
        <span slot-scope="scope">
          {{ scope.row.createdTime | dateFormat }}
        </span>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" @click="onAllocMenu(scope.row.id)">分配菜单</el-button>
            <el-button type="text">分配资源</el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="onDelete(scope.row)">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog 默认为 隐藏 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <dialog-form :form="form" />
      <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="isConfirm" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  getAllRole,
  addOrUpdateRole,
  deleteRole,
  getRolePages
} from '@/services/role'
import DialogForm from './components/DialogForm'

export default {
  name: 'RoleIndex',
  components: {
    DialogForm
  },
  computed: {
    isConfirm () {
      // 角色名称和角色编码为必填项
      return this.form.name.trim() === '' || this.form.code.trim() === ''
    }
  },
  data () {
    return {
      dialogTitle: '添加角色',
      searchWorld: '',
      tableData: [],
      dialogFormVisible: false,
      form: {
        name: '',
        code: '',
        description: ''
      },
      searchForm: {
        name: '',
        id: '',
        description: '',
        startCreateTime: ''
      }
    }
  },
  created () {
    this.loadAllRole()
  },
  methods: {
    // 搜索角色
    async onSearch () {
      const { data } = await getRolePages(this.searchForm)
      // console.log(data)
      if (data.code === '000000' && data.data.total > 0) {
        this.tableData = data.data.records
        this.$message.success('获取成功')
      } else {
        this.$message.info('暂无数据')
      }
    },
    // 重置搜索条件
    onResetSearch () {
      this.$refs.searchForm.resetFields()
    },
    // 获取 角色列表
    async loadAllRole () {
      const { data } = await getAllRole()
      if (data.code === '000000') {
        this.tableData = data.data.reverse()
      } else {
        this.$message.error(data.mesg + ', 请联系管理员,')
      }
    },
    // 添加角色
    addRole () {
      this.dialogTitle = '添加角色'
      this.form.name = ''
      this.form.id = ''
      this.form.description = ''
      this.form.code = ''
      delete this.form.id
      this.dialogFormVisible = true
    },
    // 编辑角色
    onEdit (data) {
      this.dialogTitle = '编辑角色'
      this.form.name = data.name
      this.form.id = data.id
      this.form.description = data.description
      this.form.code = data.code
      this.dialogFormVisible = true
    },
    // 删除角色
    onDelete (role) {
      // console.log(data)
      // deleteRole
      this.$confirm('删除后无法撤回，确定是否删除?', '删除角色提示', {
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteRole(role.id)
        if (data.code === '000000') {
          this.loadAllRole()
          this.$message.success('删除成功')
        } else {
          this.$message.error(data.mesg + data.code)
        }
      }).catch(() => {
        console.log('cancel delete.')
      })
    },
    // 确定添加或更新
    async onConfirm () {
      const { data } = await addOrUpdateRole(this.form)
      if (data.code === '000000') {
        if (this.dialogTitle === '添加角色') {
          this.$message.success('添加成功')
        } else {
          this.$message.success('更新成功')
        }
        this.loadAllRole()
        this.dialogFormVisible = false
      } else {
        this.$message.error(data.mesg + data.code)
      }
    },
    // 给角色分配菜单
    onAllocMenu (roleId) {
      this.$router.push({
        name: 'alloc-menu',
        params: {
          roleId
        }
      })
    }
  },
  filters: {
    dateFormat (date) {
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
  }
}
</script>

<style lang="scss" scoped>
.role-container {
  .header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: normal;
  }
  .add-role {
    padding-bottom: 20px;
  }
  .search-role {
    display: flex;
    justify-content: space-between;
    padding-left: 50px;
  }
}
</style>
