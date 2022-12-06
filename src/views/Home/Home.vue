<template>
  <div class="page-container">
    <div class="content-container">
      <BookmarksTree />
    </div>
  </div>
</template>

<script setup>
import BookmarksTree from '@/components/BookmarksTree'
</script>

<style lang="less" scoped>
.page-container {
  .content-container {
    height: 100%;
    padding: 1rem;
  }
}
</style>
