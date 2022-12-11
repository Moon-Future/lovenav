<template>
  <Popover>
    222222
  </Popover>
</template>

<script setup>
import { ref } from 'vue'
import Popover from '@/components/Popover'

const props = defineProps({
  menuList: [
    { name: '重命名', type: 'rename' },
    { name: '移动', type: 'move' },
    { name: '删除', type: 'remove' },
  ],
})
</script>

<style lang="less" scoped></style>
