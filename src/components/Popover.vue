<template>
  <div class="popover-container" v-if="popoverShow">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const popoverShow = ref(true)


const show = () => {
  popoverShow.value = true
}

const hide = () => {
  popoverShow.value = false
}
</script>

<style lang="less" scoped>
.popover-container {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
