<!-- /资源管理/权限管理 -->
<template>
  <div class="resource">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="资源名称" prop="name">
        <el-input size="small" v-model="form.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="path">
        <el-input size="small" v-model="form.path" clearable></el-input>
      </el-form-item>
      <el-form-item label="资源分类" prop="region">
        <el-select size="small" v-model="form.region" placeholder="全部" clearable>
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="onReset">重置</el-button>
        <el-button
          size="small"
          type="primary"
          :disabled="loading"
          @click="onSearch">搜索查询</el-button>
      </el-form-item>
    </el-form>
    <div class="resource-body">
      <el-row class="resource-btns">
        <el-button size="small">添加</el-button>
        <el-button size="small">资源分类</el-button>
      </el-row>
      <el-table
        :data="tableData"
        border
        v-loading='loading'
        style="width: 100%">
        <el-table-column
          label="编号"
          align="center"
          prop="id"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="url"
          label="资源路径">
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
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template>
            <el-button size="small">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="reqData.current"
      :page-sizes="[10, 15, 20]"
      :page-size="reqData.size"
      :disabled="loading"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import {
  getResourcePages,
  getResourceCategory
} from '@/services/resource'

export default {
  name: 'ResourceIndex',
  data () {
    return {
      form: {
        name: '',
        path: '',
        region: ''
      },
      total: 0,
      loading: false,
      tableData: [], // 资源列表
      categories: [], // 资源分类列表
      reqData: {
        current: 1,
        size: 10
      }
    }
  },
  created () {
    this.loadResource()
    this.loadCategory()
  },
  methods: {
    // 获取资源列表
    async loadResource () {
      this.loading = true
      const { data } = await getResourcePages(this.reqData)
      if (data.code === '000000') {
        if (data.data.total === 0) this.$message.info('暂无数据')
        this.tableData = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error(data.mesg + ', 请联系管理员')
      }
      this.loading = false
    },
    // 获取资源分类列表
    async loadCategory () {
      const { data } = await getResourceCategory()
      if (data.code === '000000') {
        this.categories = data.data
      } else {
        this.$message.error(data.mesg + ', 请联系管理员')
      }
    },
    // 设置每页展示条数
    handleSizeChange (val) {
      this.reqData.size = val
      this.loadResource()
    },
    // 跳转指定页
    handleCurrentChange (val) {
      this.reqData.current = val
      this.loadResource()
    },
    // 搜索查询
    onSearch () {
      // if (this.form.name === '' && this.form.path === '' && this.form.region === '') return
      this.reqData.name = this.form.name
      this.reqData.url = this.form.path
      this.reqData.current = 1
      this.reqData.categoryId = this.form.region
      this.loadResource()
    },
    // 重置查询提条件
    onReset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.resource {
  .el-form {
    display: flex;
    align-items: center;
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
  }
  .resource-body {
    background-color: #fff;
    .resource-btns {
      padding: 20px;
      border-top: 1px solid #ebeef5;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}
</style>
