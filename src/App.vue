<template>
  <img class="app-bg" :src="src" alt="" />
  <el-button class="wallpaper-btn" type="primary" @click="change">切换壁纸</el-button>
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

const userInfo = computed(() => userStore.userInfo)

const defaultSrc = [
  'https://i.picsum.photos/id/869/1920/1080.jpg?hmac=1UWCkJAEV3_lc_GRqEcUXsRqTEng_1stESqAcXDA9ns',
  'https://i.picsum.photos/id/588/1920/1080.jpg?hmac=XH1MBw8Tq8xKLCDBnV6B30zUdgSeOMArzz2QKLlPgp8',
]

const change = async () => {
  random.value += 1
  const res = await axios.get(`https://unsplash.it/1920/1080?random=${random.value}`)
  const url = res.request.responseURL
  src.value = url
  try {
    await globalProperties.$api.setUserConfig({
      configMap: {
        [userConfigType.wallpaper.id]: url,
      },
    })
  } catch (e) {
    console.log(e)
  }
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
    if (!userInfo.value) return
    const res = await globalProperties.$api.getUserConfig({ configTypeList: [userConfigType.wallpaper.id] })
    const userConfig = res.data
    userStore.setUserConfig(userConfig)
    if (userConfig[userConfigType.wallpaper.id]) {
      src.value = userConfig[userConfigType.wallpaper.id].config_value
    } else {
      src.value = defaultSrc[0]
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>
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
  right: 0;
  bottom: 0;
}
</style>
