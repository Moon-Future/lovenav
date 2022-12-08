<template>
  <img class="app-bg" :src="src" alt="" />
  <el-button class="wallpaper-btn" type="primary" @click="change">切换壁纸</el-button>
  <router-view />
  <NavList />
</template>

<script setup>
import NavList from '@/components/NavList'
import { ref } from 'vue'

const random = ref(1)
const src = ref('https://i.picsum.photos/id/588/1920/1080.jpg?hmac=XH1MBw8Tq8xKLCDBnV6B30zUdgSeOMArzz2QKLlPgp8')

const change = () => {
  random.value += 1
  src.value = `https://unsplash.it/1920/1080?random=${random.value}`
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
}
.wallpaper-btn {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
