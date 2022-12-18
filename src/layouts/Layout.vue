<template>
  <div class="layout">
    <div class="app-content" :class="{ close: closeStatus }">
      <div class="app-tools">
        <!-- <svg-icon iconName="icon-minus-circle-fill" @click="close" /> -->
        <svg-icon iconName="icon-roundclosefill" @click="close" />
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const closeStatus = ref(false)
const router = useRouter()

const close = () => {
  console.log('close')
  closeStatus.value = true
  setTimeout(() => {
    router.push('/home')
  }, 300)
}
</script>

<style lang="less" scoped>
.layout {
  height: calc(100vh - 70px);
  display: flex;
  .app-content {
    position: relative;
    margin: auto;
    width: 80%;
    height: calc(100vh - 100px);
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 8px 32px 0 rgb(31 38 135 / 20%);
    opacity: 0.9;
    animation: openAni 0.3s linear forwards;
    &.close {
      animation: closeAni 0.3s linear forwards;
    }
    .app-tools {
      position: absolute;
      right: 0;
      height: 48px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 60px;
      font-size: 20px;
      svg {
        cursor: pointer;
      }
    }
  }
}
@keyframes closeAni {
  0% {
    height: calc(100vh - 100px);
    opacity: 0.9;
  }
  100% {
    height: 0;
    opacity: 0;
    display: none;
  }
}
@keyframes openAni {
  0% {
    height: 0;
    opacity: 0;
    display: none;
  }
  100% {
    height: calc(100vh - 100px);
    opacity: 0.9;
  }
}
</style>
