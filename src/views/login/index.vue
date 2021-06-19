<!-- 用户登录页 -->
<template>
  <div class="user-login">
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      :rules="rules"
      ref="form" >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onLogin()"
          :loading="isLoading"
          :disabled="isDisabled">
        登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login } from '@/services/user'

export default {
  name: 'login',
  computed: {
    isDisabled () {
      return this.form.phone.length !== 11 || this.form.password.length < 6
    }
  },
  data () {
    return {
      // isLoading 避免重复点击登录
      isLoading: false,
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /1\d{10}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onLogin () {
      try {
        await this.$refs.form.validate()
        // 完成验证，发送登录请求
        this.isLoading = true
        const { data } = await login(this.form)
        this.isLoading = false
        // 请求成功后
        if (data.state === 1) {
          this.$message.success('登录成功')
          this.$router.push({ name: 'home' })
          this.$store.commit('setUser', data.content)
        } else {
          // 请求错误
          this.$message.error(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    width: 400px;
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
