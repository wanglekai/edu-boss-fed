<template>
  <div class="course-sections">
    <div class="header">
      <el-page-header
        @back="$router.push({ name: 'course' })"
        :content="title" />
      <el-button type="primary">+ 添加阶段</el-button>
    </div>
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
            <el-button size="small">编辑</el-button>
            <el-button size="small" type="primary">添加课时</el-button>
            <el-button size="small">{{currentStatus(data.status)}}</el-button>
          </span>
          <span v-else class="actions">
            <el-button size="small">编辑</el-button>
            <el-button size="small" type="success">上传视频</el-button>
            <el-button size="small">{{currentStatus(data.status)}}</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
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
      title: ''
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
    // 获取课程信息， 为了拿到 title ，要 发两个请求，无语啊，获取章节的时候 不能给一下 标题吗
    async loadCourseInof () {
      const { data } = await getCourseById(this.$route.params.courseId)
      if (data.code === '000000') {
        this.title = data.data.courseName
      } else {
        this.$message.error('获取课程信息 Error, ' + data.code + data.mesg)
      }
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
