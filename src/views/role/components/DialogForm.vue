<template>
  <el-form :model="form">
    <el-form-item label="角色名称" label-width="120px">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色编码" label-width="120px">
      <el-input v-model="form.code" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="描述" label-width="120px">
      <el-input type="textarea" v-model="form.description"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'RoelDialog',
  props: {
    form: {
      type: Object,
      required: true
    }
  }
}
</script>
