<!-- 新建课程 -->
<template>
  <div class="course-create">
     <edit-tem />
  </div>
</template>
<script>
import EditTem from './components/createOrEdit'

export default {
  name: 'CourseCreate',
  components: {
    EditTem
  }
}
</script>
<style lang='scss' scoped></style>
