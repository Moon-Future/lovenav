<template>
  <el-dialog class="login-dialog" :model-value="userStore.loginVisible" @close="handleClose">
    <div class="login-wrapper">
      <img class="left-img" src="../assets/image/login-left.jpg" alt="" />
      <div class="right-form">
        <div class="login-title">
          <p class="title">欢迎使用一个书签</p>
          <p class="desc">现在登陆你的书签账号，享受更多权限</p>
        </div>
        <template v-if="formStatus === 'login'">
          <el-form class="login-form" :rules="rules" :model="formLogin">
            <el-form-item prop="email">
              <el-input v-model="formLogin.email" size="large" placeholder="邮箱" />
            </el-form-item>
            <el-form-item prop="passward">
              <el-input v-model="formLogin.passward" size="large" placeholder="密码" />
            </el-form-item>
          </el-form>
          <el-button type="primary" size="large">登陆</el-button>
          <div class="login-footer">
            <span @click="changeFormStatus('register')">还没有账号？现在注册</span>
            <span>忘记密码</span>
          </div>
        </template>
        <template v-else>
          <el-form class="login-form" :rules="rules" :model="formLogin">
            <el-form-item prop="email">
              <el-input v-model="formLogin.email" size="large" placeholder="邮箱" />
            </el-form-item>
            <el-form-item class="code-item" prop="code">
              <el-input class="code-input" v-model="formLogin.code" size="large" placeholder="验证码" />
              <el-button type="primary" size="large">获取验证码</el-button>
            </el-form-item>
            <el-form-item prop="passward">
              <el-input v-model="formLogin.passward" size="large" placeholder="密码" type="password" show-password />
            </el-form-item>
            <el-form-item prop="rePassward">
              <el-input v-model="formLogin.rePassward" size="large" placeholder="重复密码" type="password" show-password />
            </el-form-item>
          </el-form>
          <el-button type="primary" size="large">注册</el-button>
          <div class="login-footer">
            <span @click="changeFormStatus('login')">已有账号？马上登陆</span>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formStatus = ref('login') // login register
const formLogin = ref({
  email: '',
  code: '',
  passward: '',
  rePassward: '',
})

const rules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  passward: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  rePassward: [{ required: true, message: '请重复邮箱', trigger: 'blur' }],
}

const handleClose = () => {
  userStore.setLoginVisible(false)
}

const changeFormStatus = (status) => {
  formStatus.value = status
}
</script>

<style lang="less" scoped>
.login-wrapper {
  display: flex;
  height: 100%;
  .left-img {
    width: 300px;
    height: 100%;
    object-fit: cover;
    border-radius: 4px 0 0 4px;
  }
  .right-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(100% - 300px);
    padding: 0 40px;
    text-align: left;
    .login-title {
      .title {
        font-size: 30px;
        font-weight: bold;
        color: #000;
        margin-bottom: 10px;
      }
    }
    .login-form {
      margin-top: 30px;
      .code-item {
        display: flex;
        .code-input {
          width: 60%;
          margin-right: 10px;
        }
      }
    }
  }
  .login-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    span {
      cursor: pointer;
      &:hover {
        color: #000;
      }
    }
  }
}
</style>
<style lang="less">
.login-dialog {
  width: 800px;
  border-radius: 4px;
  .el-dialog__header {
    position: absolute;
    width: 100%;
    padding: 0;
    .el-dialog__headerbtn {
      top: 0;
    }
  }
  .el-dialog__body {
    padding: 0;
    height: 500px;
  }
}
</style>
