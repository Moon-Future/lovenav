<template>
  <img class="app-bg" :src="src" alt="" @load="imgLoad" v-if="src" />
  <div class="wallpaper-btn">
    <img class="windmill-icon" :class="{ changing: wallpaperLoading }" src="./assets/image/windmill.png" alt="" @click="change" />
    <div class="windmill-bar"></div>
  </div>
  <router-view />
  <NavList />
  <UserDrawer />
</template>

<script setup>
import NavList from '@/components/NavList'
import UserDrawer from '@/components/UserDrawer'
import { computed, onMounted, ref } from 'vue'
import { getGlobalProperties } from '@/utils/index'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import { userConfigType } from '@/config'

const random = ref(1)
const src = ref('')
const globalProperties = getGlobalProperties()
const userStore = useUserStore()
const wallpaperLoading = ref(false)

const userInfo = computed(() => userStore.userInfo)

const defaultSrc = [
  'https://i.picsum.photos/id/869/1920/1080.jpg?hmac=1UWCkJAEV3_lc_GRqEcUXsRqTEng_1stESqAcXDA9ns',
  'https://i.picsum.photos/id/588/1920/1080.jpg?hmac=XH1MBw8Tq8xKLCDBnV6B30zUdgSeOMArzz2QKLlPgp8',
]

const change = async () => {
  if (wallpaperLoading.value) return
  random.value += 1
  wallpaperLoading.value = true
  try {
    const res = await axios.get(`https://unsplash.it/1920/1080?random=${random.value}`)
    const url = res.request.responseURL
    src.value = url
    await globalProperties.$api.setUserConfig({ type: userConfigType.wallpaper.id, value: url })
  } catch (e) {
    wallpaperLoading.value = false
    globalProperties.$message({
      message: '连接超时，请稍后重试',
      type: 'warning',
      duration: 1500,
    })
    console.log(e)
  }
}

const imgLoad = () => {
  wallpaperLoading.value = false
}

onMounted(async () => {
  await getUserInfo()
  await getUserConfig()
})

const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await globalProperties.$api.getUserInfo({ token })
    if (res.status === 1) {
      userStore.setUserInfo(res.data)
    }
  } catch (e) {
    console.log(e)
  }
}

const getUserConfig = async () => {
  try {
    if (!userInfo.value) {
      src.value = defaultSrc[0]
      return
    }
    const configTypeList = []
    for (let key in userConfigType) {
      configTypeList.push(userConfigType[key].id)
    }
    const res = await globalProperties.$api.getUserConfig({ configTypeList })
    const userConfig = res.data
    userStore.setUserConfig(userConfig)
    if (userConfig[userConfigType.wallpaper.id]) {
      src.value = userConfig[userConfigType.wallpaper.id]
    } else {
      src.value = defaultSrc[0]
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="less" scoped>
.app-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  user-select: none;
}
.wallpaper-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
  .windmill-icon {
    width: 60px;
    cursor: pointer;
    &.changing {
      animation:  rotation 3s linear infinite;
      cursor: not-allowed;
    }
  }
  .windmill-bar {
    background: #fff;
    width: 4px;
    height: 60px;
    position: absolute;
    top: 28px;
    left: 28px;
    border-radius: 4px;
    z-index: -1;
  }
}

@keyframes rotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
