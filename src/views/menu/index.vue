<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          @click="$router.push({name: 'menu-create'})"
        >添加菜单</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          label="编号"
          align="center"
          type="index"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="菜单名称">
        </el-table-column>
        <el-table-column
          prop="level"
          align="center"
          label="菜单级数">
        </el-table-column>
        <el-table-column
          prop="icon"
          align="center"
          label="前端图标">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          align="center"
          label="排序">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import {
  getAllMenu,
  deleteMenu
} from '@/services/menu'

export default {
  name: 'MenuIndex',
  created () {
    this.loadAllMenu()
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    async loadAllMenu () {
      const { data } = await getAllMenu()
      if (data.code === '000000') {
        this.tableData = data.data
      } else {
        this.$message.error(data.mesg + ', 请联系管理员')
      }
    },
    // 删除菜单提示
    handleDelete (rowData) {
      const idx = this.tableData.indexOf(rowData)
      this.$confirm('确定删除该菜单吗?', '删除提示', {
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteMenu(rowData.id)
        if (data.code === '000000') {
          // const idx = this.tableData.findIndex(rowData)
          this.tableData.splice(idx, 1)
          this.$message.success('删除成功!')
        } else {
          this.$message.error(data.mesg + ', 请联系管理员')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 编辑菜单
    handleEdit (data) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: data.id
        }
      })
    }
  }
}
</script>
