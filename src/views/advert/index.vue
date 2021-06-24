<template>
  <el-card class="advert-list">
    <div slot="header" class="clearfix">
      <el-button>添加广告</el-button>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="广告名称">
      </el-table-column>
      <el-table-column
        prop="text"
        label="广告位置">
      </el-table-column>
      <el-table-column
        prop="img"
        label="广告图片">
        <template slot-scope="scope">
          <img :src="scope.row.img" style="height: 80px;">
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="时间">
        <template slot-scope="scope">
          <div>{{ scope.row.startTime | dateFormat}}</div>
          <div>{{ scope.row.endTime | dateFormat}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="上线/下线">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status===1"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editAdvert(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import { getAdList } from '@/services/advert'

export default {
  name: 'advert',
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
      const { data } = await getAdList()
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
