<template>
  <el-drawer v-model="userStore.drawerShow" title="I am the title" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

</script>

<style lang="less" scoped></style>
