<template>
  <el-drawer class="user-drawer" v-model="userStore.drawerShow" title="I am the title" size="450" :with-header="false">
    <div class="tabs">
      <div class="tab-item" :class="{ 'tab-active': tabType === item.type }" v-for="(item, index) in tabs" :key="index" @click="changeTab(item)">
        <svg-icon class="tab-icon" :iconName="item.icon" :color="tabType === item.type ? '#409EFF' : '#333333'" />
        <span class="tab-name">{{ item.name }}</span>
      </div>
    </div>
    <el-scrollbar class="user-scrollbar">
      <div class="user-item login-item" @click="handleLoginClick">
        <svg-icon class="login-icon" :iconName="userInfo ? 'icon-shuqian-' : 'icon-shangsuo'" />
        <div class="login-text">
          <p class="login-title">{{ userInfo ? userInfo.nick_name || userInfo.email : '登陆/注册' }}</p>
          <p class="login-desc" v-if="!userInfo">解锁更多实用功能</p>
          <el-button type="primary" size="small" @click.stop="logout" v-if="userInfo">退出</el-button>
        </div>
      </div>
    </el-scrollbar>
  </el-drawer>
  <UserLogin />
</template>

<script setup>
import { computed, ref } from 'vue'
import UserLogin from '@/components/UserLogin'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const tabs = ref([
  { name: '我的', icon: 'icon-wowode', type: 'my' },
  { name: '设置', icon: 'icon-setting', type: 'setting' },
])
const tabType = ref('my')

const userInfo = computed(() => {
  return userStore.userInfo
})

const changeTab = (item) => {
  tabType.value = item.type
}

const handleLoginClick = () => {
  userStore.setLoginVisible(true)
}

const logout = () => {
  userStore.setUserInfo(null)
  localStorage.removeItem('token')
}
</script>

<style lang="less" scoped>
.tabs {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid #fff;
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .tab-icon {
      font-size: 26px;
    }
    .tab-name {
      font-size: 14px;
    }
    &.tab-active {
      color: #409eff;
    }
  }
}
.user-scrollbar {
  padding: 0 20px;
  height: calc(100% - 70px);
  background: #f4f4f5;
  .user-item {
    background: #fff;
    padding: 10px 20px;
    margin: 20px 0;
    border-radius: 6px;
    text-align: left;
  }
  .login-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    .login-icon {
      font-size: 60px;
    }
    .login-text {
      margin-left: 10px;
      .login-title {
        font-weight: bold;
      }
      .login-desc {
        font-size: 14px;
        color: #b1b3b8;
      }
    }
  }
}
</style>
<style lang="less">
.user-drawer {
  width: 500px;
  .el-drawer__body {
    padding: 0;
  }
}
.el-overlay {
  overflow: hidden;
}
</style>
