<template>
  <el-scrollbar class="bookmark-box">
    <el-tree v-if="bookmarkData.length" class="bookmark-tree" :data="bookmarkData" :props="defaultProps" @node-click="handleNodeClick">
      <template v-slot="{ node, data }">
        <svg-icon iconName="icon-folder" v-if="data.folder" />
        <img :src="data.icon" alt="" v-else-if="data.icon" />
        <svg-icon iconName="icon-website" v-else />
        <span class="tree-label" :title="node.label" v-if="data.folder">{{ node.label }}</span>
        <a :href="data.url" class="tree-label" target="_blank" rel="noopener noreferrer" v-else>{{ node.label }}</a>
      </template>
    </el-tree>
  </el-scrollbar>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  bookmarkData: {
    typeof: Array,
    default() {
      return []
    },
  },
})

const emit = defineEmits(['nodeClick'])

const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleNodeClick = (treeNode) => {
  if (treeNode.folder) {
    emit('nodeClick', { treeNode })
  }
}
</script>

<style lang="less" scoped>
.bookmark-box {
  width: 250px;
  height: 100%;
  padding: 10px;
  /deep/ .bookmark-tree {
    > .el-tree-node {
      display: inline-block;
      width: 100%;
    }
    .tree-label {
      margin-left: 8px;
      color: inherit;
    }
  }
}
</style>
