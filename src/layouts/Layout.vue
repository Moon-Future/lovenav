<template>
  <div class='layout'>
    <!-- <img class="layout-bg" :src="`https://unsplash.it/1920/1080?random=${random}`" alt=""> -->
    <!-- <el-button class="wallpaper-btn" type="primary" @click="change">切换壁纸</el-button> -->
    <NavList />
    <div class="app-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import NavList from '@/components/NavList'
import { ref } from 'vue'

const random = ref(1)

const change = () => {
  random.value += 1
}

</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  .layout-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .wallpaper-btn {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .app-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, calc(-50% - 30px));
    width: 80%;
    height: 80%;
    border-radius: 6px;
    background: #fff;
    // border: 1px solid hsla(0,0%,100%,.18);
    box-shadow: 0 8px 32px 0 rgb(31 38 135 / 20%);
    opacity: 0.9;
  }
}
</style>