<template>
  <div class="course-list">
    <!-- 条件查询 -->
    <el-row class="header">
      <el-col :span="22">
        <el-form class="filter-course" v-model="reqData">
          <el-form-item label="课程名称">
            <el-input
              v-model="reqData.courseName"
              placeholder="课程名称"
              style="width: 300px;"
              clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="status">
              <el-option label="全部" :value="2" ></el-option>
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="$router.push({ name: 'create-course' })">
          新建课程</el-button>
      </el-col>
    </el-row>
    <!-- 课程列表 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="100">
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="课程名称"
        width="360">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格">
      </el-table-column>
      <el-table-column
        prop="sortNum"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="80">
        <template slot-scope="scope">
           <el-button
             :type="scope.row.status===1?'danger':'success'"
             size="mini"
             circle></el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            :disabled="disabled"
            :type="scope.row.status===1?'danger':'success'"
            @click="changeCourseStatus(scope.row)">
            {{scope.row.status===1?'下架':'上架'}}</el-button>
          <el-button
            size="small"
            @click="$router.push({
              name: 'edit-course',
              params: {
                courseId: scope.row.id
              }
            })">编辑</el-button>
          <el-button size="small">内容管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 课程列表 - 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="reqData.currentPage"
      :page-sizes="[15, 30, 35]"
      :page-size="reqData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import {
  getQueryCourses,
  changeState
} from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      status: 2,
      tableData: [], // 课程列表
      total: 0, // 课程总条数
      reqData: {
        // 默认请求参数
        currentPage: 1,
        pageSize: 15,
        courseName: ''
      },
      disabled: false,
      loading: false
    }
  },
  watch: {
    status (value) {
      /**
       * 分页查询课程信息 status
       * 不传 获取全部
       * 传递的话 必须是 1 或 0
       * 所以这里要 检查一下 status 的值
       */
      if (value === 2 && this.reqData.status !== undefined) {
        delete this.reqData.status
      } else {
        this.reqData.status = value
      }
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    // 加载课程列表
    async loadCourses () {
      this.loading = true
      const { data } = await getQueryCourses(this.reqData)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error(data.code + data.mesg)
      }
      this.loading = false
    },
    // 改变获取 每页展示的条数
    handleSizeChange (val) {
      this.reqData.pageSize = val
      this.loadCourses()
    },
    // 获取指定页 列表
    handleCurrentChange (val) {
      this.reqData.currentPage = val
      this.loadCourses()
    },
    // 查找课程
    onSearch () {
      this.loadCourses()
    },
    // 课程上下架
    async changeCourseStatus (course) {
      const params = { courseId: course.id }
      if (course.status === 1) {
        params.status = 0
      } else {
        params.status = 1
      }

      this.disabled = true // 发送请求时 禁用按钮
      const { data } = await changeState(params)
      // console.log(params)
      if (data.code === '000000') {
        if (course.status === 0) {
          this.$message.success(`${course.courseName} 已上架`)
          course.status = 1
        } else {
          this.$message.info(`${course.courseName} 已下架`)
          course.status = 0
        }
      } else {
        this.$message.error(data.code + data.mesg)
      }
      this.disabled = false
    }
  }
}
</script>
<style lang='scss' scoped>
.course-list {
  .filter-course,
  .el-form-item {
    display: flex;
  }
  .el-form-item {
    margin-right: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
