<template>
  <el-card class="advert-space">
    <div slot="header" class="clearfix">
      <el-button>添加广告位</el-button>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        prop="spaceKey"
        label="spaceKey"
        width="160">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="广告位名称">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editAdvert(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import { getAllSpaces } from '@/services/advert'

export default {
  name: 'advert-space',
  data () {
    return {
      tableData: [],
      loading: false
    }
  },
  created () {
    this.loadAdList()
  },
  methods: {
    editAdvert (id) {
      console.log(id)
    },
    async loadAdList () {
      this.loading = true
      const { data } = await getAllSpaces()
      if (data.state === 1) {
        this.tableData = data.content
      }
      this.loading = false
    },
    isOff (status) {
      if (status === 1) return true
      return false
    }
  }
}
</script>
