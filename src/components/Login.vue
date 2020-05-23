<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/images/logo.png" class="logo" alt="">
      </div>
      <!-- 账号密码 -->
      <el-form class="login-form" :model="loginForm" :rules="LoginRules" ref="loginForm">
        <!--账号-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="buttons">
          <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
          <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import commonRules from './user/commonRules'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      LoginRules: {
        username: commonRules.username,
        password: commonRules.password
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.loginForm.username = ''
      this.loginForm.password = ''
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: result } = await this.$axios.post('login', this.loginForm)
          if (result.meta.status !== 200) return this.$message.error('登陆失败')
          this.$message.success('登陆成功')
          console.log(result.data.token)
          localStorage.setItem('token', result.data.token)
          await this.$store.dispatch('setToken', result.data.token)
          await this.$router.push('/home')
        } else {
          console.error('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    height: 100%;
    background: #2b4b6b;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-box {
    position: relative;
    width: 450px;
    height: 300px;
    background: #fff;
  }

  .avatar-box {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    background: #eee;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }

  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
  }
</style>
