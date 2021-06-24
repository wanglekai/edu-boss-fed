<!-- 课程/课时 - 管理 -->
<template>
  <div class="course-sections">
    <div class="header">
      <el-page-header
        @back="$router.push({ name: 'course' })"
        :content="courseName" />
      <el-button type="primary" @click="addStage">+ 添加阶段</el-button>
    </div>
    <!-- 课程阶段/课程章节 列表 -->
    <el-card>
      <el-tree
        :data="data"
        :props="defaultProps"
        draggable
        v-loading="loading"
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop">
        <!-- <span class="custom-tree-node" slot-scope="{ node, data }"> -->
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button size="small" @click="editStage(node, data)">编辑</el-button>
            <el-button size="small" type="primary">添加课时</el-button>
            <el-button size="small" @click.stop>{{currentStatus(data.status)}}</el-button>
          </span>
          <span v-else class="actions">
            <el-button size="small">编辑</el-button>
            <el-button size="small"
              type="success"
              @click.stop="$router.push({
                name: 'add-video',
                params: { courseId },
                query: { lessonId: data.id }
              })">上传视频</el-button>
            <el-button @click.stop size="small">{{currentStatus(data.status)}}</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
    <!-- 添加编辑 阶段 dialog -->
    <el-dialog
      title="章节信息"
      :visible.sync="stageDialog"
      width="50%">
      <el-form
        label-width="100px"
        ref="stageForm"
        :model="stageForm"
        :rules="stageFormRules">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="stageForm.courseName" disabled />
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="stageForm.sectionName" />
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input type="textarea" v-model="stageForm.description" />
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input type="number" v-model="stageForm.orderNum">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stageDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSectionAndLesson,
  saveOrUpdateSection,
  saveOrUpdateLesson
} from '@/services/course-section'
import {
  getCourseById
} from '@/services/course'

export default {
  name: 'CourseSection',
  props: {
    // 课程id
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  created () {
    this.loadCourseInof()
    this.loadSections()
  },
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'lessonDTOS',
        // 处理 tree 组件 匹配 label 字段
        label (data) {
          return data.sectionName || data.theme
        }
      },
      loading: false,
      courseName: '',
      stageDialog: false,
      // 章节表单数据
      stageForm: {
        courseName: '',
        sectionName: '',
        description: '',
        orderNum: 0
      },
      stageFormRules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ]
      },
      isStage: true
    }
  },
  methods: {
    // 获取 课程章节内容
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.data = data.data
      }
    },
    // 当前章节状态
    currentStatus (status) {
      switch (status) {
        case 0:
          return '已隐藏'
        case 1:
          return '待更新'
        case 2:
          return '已更新'
        default:
          return 'Error'
      }
    },
    // 拖动处理
    handleAllowDrop (draggingNode, dropNode, type) {
      /**
       *  不能有放入内部的操作，但例如将章节1拖拽到章节2的课时1之前时，
       * type 为 prev，需要进一步处理
       *  所有课时都具有 sectionId，通过下面的条件，限制章节不能移动到课时前后，
       * 也不能将章节的课时移动到其他章节
       */
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 设置节点拖动后的数据更新
    // async handleNodeDrop (draggingNode, dropNode, tyoe, event) {
    async handleNodeDrop (draggingNode, dropNode) {
      /**
       * 1. 无论是章节还是课时, dropNode 都有parent(draggingNode.parent 总为 null), 内部有childNodes
            - dropNode.parent.childNodes 可获取拖拽项所在列表的所有数据
            - 遍历操作
         4. 由于是批量请求，可以使用 Promise.all() 便于进行统一操作
            - 将 map 返回的，由 Axios 调用返回的 Promise 对象组成的数组，传入到 Promise.all() 中
            - 设置 async await 并进行 try..catch 处理
       */
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          this.loading = true
          // 2. 对章节与课时进行分别处理
          //   - 除了 draggingNode.data.sectionId 外，draggingNode.lessonDTOS 也可以判断
          if (draggingNode.data.lessonDTOS) {
            // 章节操作
            return saveOrUpdateSection({
              id: item.data.id,
              // 按现在的索引顺序给当前级别列表设置排序序号
              orderNum: index
            })
          } else {
            // 课时操作（同上）
            return saveOrUpdateLesson({
              id: item.data.id,
              // 按现在的索引顺序给当前级别列表设置排序序号
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.success('数据更新失败', err)
      }
      this.loading = false
    },
    // 获取课程信息
    async loadCourseInof () {
      const { data } = await getCourseById(this.$route.params.courseId)
      if (data.code === '000000') {
        this.courseName = data.data.courseName
      } else {
        this.$message.error('获取课程信息 Error, ' + data.code + data.mesg)
      }
    },
    // 添加阶段
    addStage () {
      this.stageForm.courseName = this.courseName
      // 新增阶段的时候 不能有课程id 值
      this.stageForm.sectionName = ''
      this.stageForm.description = ''
      this.stageForm.orderNum = 0
      if (this.stageForm.id !== undefined) delete this.stageForm.id
      this.stageDialog = true
    },
    async confirmSave () {
      try {
        await this.$refs.stageForm.validate()
        this.stageForm.courseId = this.courseId

        const { data } = await saveOrUpdateSection(this.stageForm)
        if (data.code === '000000') {
          this.$message.success('保存成功')
          this.stageDialog = false
          this.loadSections()
          this.stageForm.sectionName = ''
          this.stageForm.description = ''
          this.stageForm.orderNum = 0
        }
      } catch (error) {
        console.log('保存课程章节 Error', error)
      }
    },
    // 编辑 阶段
    editStage (node, data) {
      this.stageForm.courseName = this.courseName
      this.stageForm.sectionName = data.sectionName
      this.stageForm.description = data.description
      this.stageForm.orderNum = data.orderNum
      this.stageForm.id = data.id
      this.stageDialog = true
    }
  }
}
</script>
<style lang='scss' scoped>
.course-sections {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-card {
    margin-top: 20px;
  }
}
.inner {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
