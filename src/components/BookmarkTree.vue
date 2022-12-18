<template>
  <el-scrollbar class="bookmark-box">
    <div @click="handleTreeClick">
      <el-tree
        v-if="bookmarkData.length"
        class="bookmark-tree"
        :class="{ 'event-not': bookmarkStore.sortStatus }"
        ref="bookmarkTree"
        node-key="id"
        :data="bookmarkData"
        :props="defaultProps"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false"
        :auto-expand-parent="false"
        highlight-current
        @node-click="handleNodeClick"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
        @node-contextmenu="handleContextmenu"
      >
        <template v-slot="{ node, data }">
          <div class="tree-node-item" :ref="(ref) => (refMap[data.id + '_left'] = ref)">
            <svg-icon :iconName="expandedKeys.includes(data.id) ? 'icon-opened_folder' : 'icon-folder'" v-if="data.folder" />
            <img class="tree-icon" :src="data.icon" alt="" v-else-if="data.icon" />
            <svg-icon iconName="icon-website" v-else />
            <span class="tree-label" :title="node.label" v-if="data.folder">{{ node.label }}</span>
            <a :href="data.url" class="tree-label" :title="node.label" target="_blank" rel="noopener noreferrer" v-else>{{ node.label }}</a>
          </div>
        </template>
      </el-tree>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useBookmarkStore } from '@/stores/bookmark'
import { getGlobalProperties } from '@/utils/index'

const props = defineProps({
  bookmarkData: {
    typeof: Array,
    default() {
      return []
    },
  },
})

const emit = defineEmits(['nodeClick', 'openOperateMenu', 'hideOperateMenu'])
const expandedKeys = ref([])
const bookmarkTree = ref()
const refMap = ref({})
const bookmarkStore = useBookmarkStore()
const globalProperties = getGlobalProperties()

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(
  () => props.bookmarkData,
  (newValue) => {
    nextTick(() => {
      if (newValue[0]) {
        handleNodeExpand(newValue[0])
        handleNodeClick(newValue[0])
      }
    })
  }
)

const handleNodeClick = (treeNode) => {
  if (bookmarkStore.sortStatus) {
    bookmarkStore.changeSortStatus(false)
  }
  emit('hideOperateMenu')
  if (treeNode.folder) {
    emit('nodeClick', { treeNode })
  }
}

const handleNodeExpand = (treeNode) => {
  emit('hideOperateMenu')
  if (treeNode.folder) {
    emit('nodeClick', { treeNode, type: 'expand' })
  }
}

const handleNodeCollapse = (treeNode) => {
  emit('hideOperateMenu')
  if (treeNode.folder) {
    emit('nodeClick', { treeNode, type: 'collapse' })
  }
}

const handleExpandedKeys = (key, type) => {
  bookmarkTree.value.setCurrentKey(key)
  const arr = [].concat(expandedKeys.value)
  if (type === 'expand') {
    !arr.includes(key) && arr.push(key)
  } else if (type === 'collapse') {
    arr.includes(key) && arr.splice(arr.indexOf(key), 1)
  }
  expandedKeys.value = arr
}

const handleContextmenu = (event, data, node, comp) => {
  handleNodeClick(data)
  emit('openOperateMenu', { ref: refMap.value[data.id + '_left'], data })
}

// 排序时不可点击树
const handleTreeClick = () => {
  globalProperties.$message({
    message: '排序中...',
    type: 'warning',
    duration: 1500,
  })
}

defineExpose({
  handleExpandedKeys,
})
</script>

<style lang="less" scoped>
.bookmark-box {
  min-width: 250px;
  height: calc(100% - 40px);
  padding: 10px;
  :deep(.bookmark-tree) {
    user-select: none;
    > .el-tree-node {
      display: inline-block;
      min-width: 100%;
    }
    .is-current > .el-tree-node__content {
      background-color: #d9ecff;
    }
    .tree-node-item {
      display: flex;
      align-items: center;
      .tree-icon {
        width: 1em;
        height: 1em;
      }
    }
    .tree-label {
      margin-left: 8px;
      color: inherit;
    }
    &.event-not {
      pointer-events: none;
    }
  }
}
</style>
