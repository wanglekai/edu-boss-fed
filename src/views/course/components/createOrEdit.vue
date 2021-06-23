<template>
  <div class="edit-course">
    <el-page-header
      @back="$router.push({ name: 'course' })"
      :content="title" />
    <!-- 编辑 步骤条 -->
    <el-steps
      :active="currentStep"
      finish-status="finish"
      simple>
      <el-step
        v-for="(item, index) in steps"
        :key="item.id"
        :title="item.title"
        :icon="item.icon"
        @click.native="currentStep=index"/>
    </el-steps>
    <!-- 编辑 表单 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ steps[currentStep].title }}</span>
      </div>
      <el-form
        :model="form"
        label-width="80px"
        ref="form">
        <!-- 课程基本信息 -->
        <el-row v-show="currentStep === 0">
          <el-form-item label="课程名称">
            <el-input
              v-model.trim="form.courseName"
              maxlength="50"
              clearable
              show-word-limit/>
          </el-form-item>
          <el-form-item label="简介">
            <el-input
              v-model.trim="form.brief"
              maxlength="100"
              clearable
              show-word-limit/>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input
              v-model.trim="form.teacherDTO.teacherName"
              maxlength="50"
              clearable
              show-word-limit/>
          </el-form-item>
          <el-form-item label="职位">
            <el-input
              v-model.trim="form.teacherDTO.position"
              maxlength="50"
              clearable
              show-word-limit/>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input
              v-model.trim="form.teacherDTO.description"
              maxlength="100"
              clearable
              show-word-limit/>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              style="width: 49%;"
              v-model="form.previewFirstField"
              maxlength="20"
              show-word-limit/>
            <el-input
              style="width: 49%; margin-left: 2%;"
              v-model="form.previewSecondField"
              maxlength="20"
              show-word-limit/>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input
              v-model="form.sortNum"
              :min="1"
              type="number"
              controls-position="right">
              <template slot="append">数字控制排序，数字越大越靠后</template>
            </el-input>
          </el-form-item>
        </el-row>
        <!-- 课程封面 -->
        <el-row v-show="currentStep === 1">
          <upload-image v-model="form.courseListImg" label="课程封面" />
          <upload-image v-model="form.courseImgUrl" label="解锁封面" />
        </el-row>
        <!-- 销售信息 -->
        <el-row v-show="currentStep === 2">
          <el-form-item label="售卖价格" prop="discounts">
            <el-input type="number" v-model="form.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input type="number" v-model="form.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input type="number" v-model="form.sales" :min="0" controls-position="right">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="form.discountsTag" maxlength="4" show-word-limit/>
          </el-form-item>
        </el-row>
        <!-- 秒杀活动 -->
        <el-row v-show="currentStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120">
            <el-switch
              v-model="form.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </el-form-item>
          <el-row v-if="form.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="form.activityCourseDTO.beginTime"
                type="datetime"
                default-time="12:00:00"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="form.activityCourseDTO.endTime"
                type="datetime"
                default-time="12:00:00"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input type="number" :min="0" v-model="form.activityCourseDTO.amount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input type="number" :min="0" v-model="form.activityCourseDTO.stock">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </el-row>
        </el-row>
        <!-- 课程详情 -->
        <el-row v-show="currentStep === 4">
          <el-form-item>
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="form.courseDescriptionMarkDown" />
          </el-form-item>
          <el-form-item label="是否上架" class="switch-status">
            <el-switch
              v-model="form.status"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-row>
        <!-- 控制按钮 -->
        <el-form-item class="control-btn">
          <el-button
            type="primary"
            v-show="currentStep !== 0"
            @click="--currentStep">上一步</el-button>
          <el-button
            type="primary"
            v-show="currentStep !== 4"
            @click="++currentStep">下一步</el-button>
          <el-button
            type="primary"
            v-show="currentStep === 4"
            @click="handleOnSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getCourseById,
  saveOrUpdateCourse
} from '@/services/course'
import UploadImage from './UploadImage.vue'

export default {
  name: 'EditCourse',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: { UploadImage },
  computed: {
    title () {
      return this.isEdit ? '编辑课程' : '新建课程'
    }
  },
  created () {
    // 如果是编辑课程 需要首次加载课程信息
    if (this.isEdit) this.loadCourseInof()
  },
  data () {
    return {
      currentStep: 0,
      steps: [
        { id: 101, title: '基本信息', icon: 'el-icon-edit' },
        { id: 102, title: '课程封面', icon: 'el-icon-picture' },
        { id: 103, title: '销售信息', icon: 'el-icon-shopping-bag-2' },
        { id: 104, title: '秒杀活动', icon: 'el-icon-alarm-clock' },
        { id: 105, title: '课程详情', icon: 'el-icon-edit-outline' }
      ],
      form: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0, // 优惠价
        priceTag: '',
        discountsTag: '', // 活动标签
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0, // 0 为草稿， 1为 上架
        sales: 0,
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    //   rules: {
    //     courseName: [
    //       { required: true, message: '请输入课程名称', trigger: 'blur' }
    //     ],
    //     brief: [
    //       { required: true, message: '请输入课程简介', trigger: 'blur' }
    //     ],
    //     teacherName: [
    //       { required: true, message: '请输入讲师姓名', trigger: 'blur' }
    //     ],
    //     position: [
    //       { required: true, message: '请输入讲师职位', trigger: 'blur' }
    //     ],
    //     description: [
    //       { required: true, message: '请输入讲师简介', trigger: 'blur' }
    //     ],
    //     previewFirstField: [
    //       { required: true, message: '请输入课程概述', trigger: 'blur' }
    //     ],
    //     sortNum: [
    //       { required: true, message: '请输入课程排序', trigger: 'blur' }
    //     ],
    //     discounts: [
    //       { required: true, message: '请输入售卖价格', trigger: 'blur' }
    //     ]
    //   }
    }
  },
  methods: {
    // 编辑页 通过id 获取课程信息
    async loadCourseInof () {
      const { data } = await getCourseById(this.$route.params.courseId)
      if (data.code === '000000') {
        this.form = data.data
        this.changeStatus(this.form.status)
      } else {
        this.$message.error('获取课程信息 Error, ' + data.code + data.mesg)
      }
    },
    // 保存或更新 课程信息
    async handleOnSave () {
      this.changeStatus(this.form.status)
      const { data } = await saveOrUpdateCourse(this.form)
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '更新' : '新建'} 成功`)
        this.$router.push({ name: 'course' })
      }
    },
    changeStatus (status) {
      // form.status 保存的是 Boolean 需要改为数字
      if (typeof status === 'number') {
        this.form.status = Boolean(status)
      } else {
        this.form.status = Number(status)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-course {
  .el-steps {
    margin-top: 20px;
    background-color: #fff;
  }
  .el-step {
    cursor: pointer;
  }
  .box-card {
    margin-top: 10px;
  }
  .control-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0;
  }
}
</style>
