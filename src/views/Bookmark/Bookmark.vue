<template>
  <div class="bookmark-container">
    <div class="header-container">
      <!-- <span>速达书签</span> -->
    </div>
    <BookmarksTree class="bookmark-content" />
  </div>
</template>

<script setup>
import BookmarksTree from '@/components/BookmarksTree'
</script>

<style lang="less" scoped>
.bookmark-container {
  height: 100%;
  .header-container {
    height: 48px;
    background: #eee;
    border: 1px solid #eee;
    padding: 20px;
    display: flex;
    align-items: center;
  }
  .bookmark-content {
    height: calc(100% - 48px);
  }
}
</style>
