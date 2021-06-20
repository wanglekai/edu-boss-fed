<template>
  <div class="menu-create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ cartTitle }}</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="ruleForm.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="无上级菜单" value="-1"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="ruleForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="ruleForm.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="ruleForm.orderNum"
            size="small"
            :min="0"
            :max="5"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">立即创建</el-button>
          <el-button
            v-if="!isEdit"
            @click="resetForm('ruleForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import {
  getEditMenuInfo,
  createMenu
} from '@/services/menu'

export default {
  name: 'MenuCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cartTitle () {
      return this.isEdit ? '编辑菜单' : '添加菜单'
    }
  },
  data () {
    return {
      ruleForm: {
        parentId: 1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入相关描述', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' }
        ]
      },
      // 存储上级列表信息
      parentMenuList: []
    }
  },
  created () {
    this.loadEditMenuInfo()
  },
  methods: {
    // 确认创建 菜单
    async submitForm () {
      try {
        await this.$refs.ruleForm.validate()
        const { data } = await createMenu(this.ruleForm)
        // console.log(data)
        if (data.code === '000000') {
          this.$message.success('保存成功')
          this.$router.push({ name: 'menu' })
        } else {
          this.$message.error(data.mesg + ', 请联系管理员')
        }
      } catch (error) {
        console.log('error submit!!')
        return false
      }
    },
    // 重置内容
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 获取编辑菜单列表
    async loadEditMenuInfo () {
      const id = this.$route.params.id || -1
      const { data } = await getEditMenuInfo(id)
      // console.log(data)
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
        if (data.data.menuInfo) {
          this.ruleForm = data.data.menuInfo
        }
      }
    }
  }
}
</script>
