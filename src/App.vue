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
import { onMounted, ref } from 'vue'
import { getGlobalProperties } from '@/utils/index'
import { useUserStore } from '@/stores/user'

const random = ref(1)
const src = ref('https://i.picsum.photos/id/588/1920/1080.jpg?hmac=XH1MBw8Tq8xKLCDBnV6B30zUdgSeOMArzz2QKLlPgp8')
const globalProperties = getGlobalProperties()
const userStore = useUserStore()

const change = () => {
  random.value += 1
  src.value = `https://unsplash.it/1920/1080?random=${random.value}`
}

onMounted(async () => {
  await getUserInfo()
})

const getUserInfo = async () =>{
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
