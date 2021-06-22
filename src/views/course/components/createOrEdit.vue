<template>
  <div class="edit-course">
    <el-page-header
      @back="$router.go(-1)"
      :content="title" />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="currentStep" finish-status="success" simple>
          <el-step
            v-for="(item, index) in steps"
            :key="item.id"
            :title="item.title"
            @click.native="currentStep=index"/>
        </el-steps>
      </div>
      <p><el-button @click="++currentStep">下一步</el-button></p>
      <div v-show="currentStep === 0">
        基本信息
      </div>
      <div v-show="currentStep === 1">
        销售信息
      </div>
      <div v-show="currentStep === 2">
        秒杀活动
      </div>
      <div v-show="currentStep === 3">
        课程详情
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'EditCourse',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑课程' : '新建课程'
    }
  },
  data () {
    return {
      currentStep: 0,
      steps: [
        { id: 101, title: '基本信息' },
        { id: 102, title: '销售信息' },
        { id: 103, title: '秒杀活动' },
        { id: 104, title: '课程详情' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-course {
  .box-card {
    margin-top: 20px;
  }
  .el-step {
    cursor: pointer;
  }
}
</style>
