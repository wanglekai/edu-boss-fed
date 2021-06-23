<template>
  <el-form-item :label="label">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :http-request="handleUpLoad"
      :limit="1"
      :file-list="fileList"
      :on-exceed="handleExceed">
      <i class="el-icon-plus"></i>
      <div class="el-upload__tip" slot="tip">
        建议尺寸：230*300px，JPG、PNG格式，图片小于150K</div>
    </el-upload>
  </el-form-item>
</template>
<script>
import { uploadPic } from '@/services/course'

export default {
  name: 'UploadImage',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    fileList () {
      return this.value === '' ? [] : [{
        name: this.label,
        url: this.value
      }]
    }
  },
  methods: {
    handleExceed () {
      this.$message.error('封面只能上传一张!')
    },
    // 上传图片
    async handleUpLoad (options) {
      const fd = new FormData()
      fd.append('file', options.file)

      const { data } = await uploadPic(fd)
      if (data.code === '000000') {
        // 上传完成后  需要通过自定义事件传递 获得的线上图片路径地址
        this.$emit('input', data.data.name)
        this.$message.success('上传完成')
      }
    }
  }
}
</script>
