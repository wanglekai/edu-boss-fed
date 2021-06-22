<!-- 编辑课程 -->
<template>
  <div class="course-edit">
     <edit-tem :isEdit="true" />
  </div>
</template>
<script>
import EditTem from './components/createOrEdit'

export default {
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    EditTem
  }
}
</script>
<style lang='scss' scoped></style>
