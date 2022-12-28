<template>
  <el-dialog
    class="login-dialog"
    :model-value="userStore.loginVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div class="login-wrapper">
      <img class="left-img" src="../assets/image/login-left.jpg" alt="" />
      <div class="right-form" v-if="!userInfo">
        <div class="login-title">
          <p class="title">欢迎使用一个书签</p>
          <p class="desc">现在登陆你的书签账号，享受更多权限</p>
        </div>
        <template v-if="formStatus === 'login'">
          <el-form class="login-form" :rules="rules" :model="formLogin" ref="ruleForm">
            <el-form-item prop="email">
              <el-input v-model="formLogin.email" size="large" placeholder="邮箱" />
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input v-model="formLogin.pwd" size="large" placeholder="密码" type="password" show-password />
            </el-form-item>
          </el-form>
          <el-button type="primary" size="large" @click="submit">登陆</el-button>
          <div class="login-footer">
            <span @click="changeFormStatus('register')">还没有账号？现在注册</span>
            <span>忘记密码</span>
          </div>
        </template>
        <template v-else>
          <el-form class="login-form" :rules="rules" :model="formLogin" ref="ruleForm">
            <el-form-item prop="email">
              <el-input v-model="formLogin.email" size="large" placeholder="邮箱" />
            </el-form-item>
            <el-form-item class="code-item" prop="code">
              <el-input class="code-input" v-model="formLogin.code" size="large" placeholder="验证码" />
              <el-button type="primary" size="large" @click="sendCode" v-if="count < 0">获取验证码</el-button>
              <el-button type="primary" size="large" disabled v-else>{{ count }}</el-button>
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input v-model="formLogin.pwd" size="large" placeholder="密码" type="password" show-password />
            </el-form-item>
            <el-form-item prop="cpwd">
              <el-input v-model="formLogin.cpwd" size="large" placeholder="重复密码" type="password" show-password />
            </el-form-item>
          </el-form>
          <el-button type="primary" size="large" @click="submit">注册</el-button>
          <div class="login-footer">
            <span @click="changeFormStatus('login')">已有账号？马上登陆</span>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getGlobalProperties } from '@/utils/index'
import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import { publicKey } from '@/config'

const $JSEncrypt = new JSEncrypt()
$JSEncrypt.setPublicKey(publicKey) // 设置公钥

const userStore = useUserStore()
const formStatus = ref('login') // login register
const formLogin = reactive({
  email: '',
  code: '',
  pwd: '',
  cpwd: '',
})
const ruleForm = ref()
const globalProperties = getGlobalProperties()
const mailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const count = ref(-1)
let intervalTime = null

const userInfo = computed(() => {
  return userStore.userInfo
})

const countInterval = () => {
  count.value = 60
  intervalTime && clearInterval(intervalTime)
  intervalTime = setInterval(() => {
    count.value -= 1
    if (count.value <= 0) {
      clearInterval(intervalTime)
      count.value = -1
    }
  }, 1000)
}

const checkEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'))
  }
  if (mailReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱格式'))
  }
}

const checkCpwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formLogin.pwd) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [{ validator: checkEmail, trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  cpwd: [{ validator: checkCpwd, trigger: 'blur' }],
}

const handleClose = () => {
  userStore.setLoginVisible(false)
  if (!userInfo) {
    ruleForm.value.resetFields()
    ruleForm.value.clearValidate()
    formStatus.value = 'login'
  }
}

const changeFormStatus = (status) => {
  formStatus.value = status
  ruleForm.value.resetFields()
  ruleForm.value.clearValidate()
}

const sendCode = () => {
  ruleForm.value.validateField('email', async (isValid) => {
    if (!isValid) return
    await globalProperties.$api.sendCode({ email: formLogin.email })
    countInterval()
  })
}

const submit = () => {
  ruleForm.value.validate(async (isValid) => {
    if (!isValid) return
    try {
      const email = formLogin.email
      const data = {
        email: email,
        pwd: $JSEncrypt.encrypt(formLogin.pwd),
      }
      if (formStatus.value === 'login') {
        const res = await globalProperties.$api.login(data)
        if (res.status === 1) {
          userStore.setUserInfo(res.data)
          userStore.setLoginVisible(false)
          localStorage.setItem('token', res.token)
        }
      } else {
        data.code = formLogin.code
        data.cpwd = $JSEncrypt.encrypt(formLogin.cpwd)
        const res = await globalProperties.$api.register(data)
        if (res.status === 1) {
          changeFormStatus('login')
          clearInterval(intervalTime)
          count.value = -1
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
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
