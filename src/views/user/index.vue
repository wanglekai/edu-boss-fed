<!-- /用户管理/ -->
<template>
  <div class="user-container">
    <el-form v-model="reqData">
      <el-form-item label="手机号">
        <el-input
          v-model="reqData.phone"
          placeholder="请输入手机号"
          clearable />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dates"
          type="daterange"
          clearable
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户列表 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="用户ID"
        width="120">
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        label="头像">
        <el-avatar
          size="small"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="80">
        <template>
           <el-button
             type="success"
             size="mini"
             circle />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="stopUse(scope.row)">禁用</el-button>
          <el-button
            type="text"
            @click="allocRole(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户列表 - 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="reqData.currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="reqData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 分配角色 dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-select
        v-model="userRoles"
        multiple
        style="width: 80%;"
        placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAllocRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserPages } from '@/services/user'
import {
  getAllRole,
  getUserRole,
  allocateUserRoles
} from '@/services/role'

export default {
  name: 'UserIndex',
  data () {
    return {
      reqData: {
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        currentPage: 1,
        pageSize: 10,
        userId: 0
      },
      dates: null,
      tableData: [],
      total: 0, // 用户总条数
      dialogVisible: false,
      userRoles: [], // 用户已有角色
      roles: [], // 所有角色,
      currentUser: null
    }
  },
  computed: {
    dialogTitle () {
      return `分配角色: ${this.currentUser ? this.currentUser.name : ''} `
    }
  },
  created () {
    this.loadUserList()
    this.loadAllRole()
  },
  methods: {
    // 按条件查询用户
    onSearch () {
      this.reqData.currentPage = 1
      if (this.dates != null) {
        this.reqData.startCreateTime = this.dates[0]
        this.reqData.endCreateTime = this.dates[1]
      } else {
        this.reqData.startCreateTime = ''
        this.reqData.endCreateTime = ''
      }
      this.loadUserList()
    },
    // 禁用
    stopUse (user) {
      this.$message.info(user.name + ' 不能禁用')
    },
    // 改变获取 每页展示的条数
    handleSizeChange (val) {
      this.reqData.pageSize = val
      this.loadUserList()
    },
    // 获取指定页 列表
    handleCurrentChange (val) {
      this.reqData.currentPage = val
      this.loadUserList()
    },
    // 获取 用户列表
    async loadUserList () {
      const { data } = await getUserPages(this.reqData)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error('获取用户列表 Error, ' + data.code + data.mesg)
      }
    },
    async loadAllRole () {
      // 获取 角色列表
      const { data } = await getAllRole()
      if (data.code === '000000') {
        this.roles = data.data
      }
    },
    // 分配角色
    async allocRole (user) {
      const { data } = await getUserRole(user.id)
      if (data.code === '000000') {
        this.userRoles = data.data.map(item => item.id)
        this.currentUser = user
        this.dialogVisible = true
      } else {
        this.$message.error('角色列表获取 Error, ' + data.code + data.mesg)
      }
    },
    // 保存分配的角色
    async confirmAllocRole () {
      const { data } = await allocateUserRoles({
        userId: this.currentUser.id,
        roleIdList: this.userRoles
      })
      if (data.code === '000000') {
        this.dialogVisible = false
        this.$message.success('保存成功')
      } else {
        this.$message.error('分配角色 Error, ' + data.code + data.mesg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  .el-form {
    display: flex;
    align-items: flex-end;
    .el-form-item {
      margin-left: 10px;
    }
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
