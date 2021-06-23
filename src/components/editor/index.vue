<template>
  <div ref="editor">
  </div>
</template>
<script>
import E from 'wangeditor'
import { uploadPic } from '@/services/course'

export default {
  name: 'EditIndex',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.editor.txt.html(val)
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      this.editor = new E(this.$refs.editor)
      this.editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadPic(fd)
        if (data.code === '000000') {
          // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(data.data.name)
        }
      }
      this.editor.config.onchange = content => {
        this.$emit('input', content)
      }
      this.editor.create()
      this.editor.txt.html(this.value)
    }
  }
}
</script>
<style lang='scss' scoped></style>
