<template>
  <div class="right-header" v-show="bookmarkData.length">
    <el-button size="small" @click="startSort" v-if="!bookmarkStore.sortStatus">排序</el-button>
    <template v-else>
      <el-button type="danger" size="small" @click="cancelSort">取消</el-button>
      <el-button type="primary" size="small" @click="saveSort">保存</el-button>
    </template>
    <svg-icon class="icon-list" iconName="icon-liebiao" :color="listType === 'list' ? '#409eff' : '#8c8c8c'" @click="changeType('list')" />
    <svg-icon class="icon-list" iconName="icon-liebiao1" :color="listType === 'box' ? '#409eff' : '#8c8c8c'" @click="changeType('box')" />
  </div>
  <el-scrollbar class="scroll-wrapper" :class="{ disabled: visiblePopover }">
    <draggable
      class="row-list"
      :class="{ 'box-list': listType === 'box' }"
      :list="bookmarkData"
      :disabled="!bookmarkStore.sortStatus"
      :force-fallback="true"
      handle=".icon-move"
      ghost-class="ghost-class"
      chosen-class="chosen-class"
      animation="300"
      group="people"
      item-key="id"
    >
      <template #item="{ element, index }">
        <div
          class="row-item"
          :class="{ 'box-item': listType === 'box', 'box-item-margin': (index + 2) % 3 === 0 }"
          filter=".unmover"
          @click="handleClick(element)"
          v-if="element.folder"
        >
          <svg-icon class="icon" iconName="icon-folder" v-if="element.folder" />
          <img class="icon" :src="element.icon" alt="" v-else-if="element.icon" />
          <svg-icon class="icon" iconName="icon-website" v-else />
          <span class="label" :title="element.label">{{ element.label }}</span>
          <svg-icon class="icon icon-move" iconName="icon-Move" v-if="bookmarkStore.sortStatus" />
          <svg-icon
            class="icon-more"
            :class="{ 'icon-more-show': moreShow === element.id && visiblePopover }"
            iconName="icon-more"
            :ref="(ref) => (refMap[element.id] = ref)"
            @click.stop="handleMore(element)"
            v-else
          />
        </div>
        <a
          class="row-item"
          :class="{ 'box-item': listType === 'box', 'box-item-margin': (index + 2) % 3 === 0 }"
          :href="element.url"
          target="_blank"
          v-else
        >
          <svg-icon class="icon" iconName="icon-folder" v-if="element.folder" />
          <img class="icon" :src="element.icon" alt="" v-else-if="element.icon" />
          <svg-icon class="icon" iconName="icon-website" v-else />
          <span class="label" :title="element.label">{{ element.label }}</span>
          <svg-icon class="icon icon-move" iconName="icon-Move" v-if="bookmarkStore.sortStatus" />
          <svg-icon
            class="icon-more"
            :class="{ 'icon-more-show': moreShow === element.id && visiblePopover }"
            iconName="icon-more"
            :ref="(ref) => (refMap[element.id] = ref)"
            @click.stop.prevent="handleMore(element)"
            v-else
          />
        </a>
      </template>
    </draggable>
  </el-scrollbar>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import draggable from 'vuedraggable'
import { useBookmarkStore } from '@/stores/bookmark'
import { getGlobalProperties } from '@/utils/index'

const props = defineProps({
  bookmarkData: {
    typeof: Array,
    default() {
      return []
    },
  },
  visiblePopover: {
    typeof: Boolean,
    default: false,
  },
})

const emit = defineEmits(['nodeClick', 'openOperateMenu', 'sortBookmark'])

const listType = ref('list')
const refMap = ref({})
const moreShow = ref('')
const bookmarkStore = useBookmarkStore()
const globalProperties = getGlobalProperties()

const changeType = (type) => {
  listType.value = type
}

const handleClick = (item) => {
  if (bookmarkStore.sortStatus) {
    globalProperties.$message({
      message: '排序中...',
      type: 'warning',
      duration: 1500
    })
    return
  }
  if (item.folder) {
    emit('nodeClick', { treeNode: item, type: 'expand' })
  }
}

const handleMore = (item) => {
  moreShow.value = item.id
  emit('openOperateMenu', { ref: refMap.value[item.id], data: item })
}

// 开始排序
const startSort = () => {
  if (bookmarkStore.sortStatus) {
    bookmarkStore.changeSortStatus(false)
  } else {
    bookmarkStore.changeSortStatus(true)
  }
}

// 取消排序
const cancelSort = () => {
  bookmarkStore.changeSortStatus(false)
  emit('sortBookmark', { cancelSort: true })
}

// 保存排序
const saveSort = () => {
  bookmarkStore.changeSortStatus(false)
  const data = props.bookmarkData.map((item) => {
    return { id: item.id, sort: item.sort }
  })
  const sortData = [].concat(data)
  sortData.sort((a, b) => {
    return a.sort - b.sort
  })
  if (JSON.stringify(data) === JSON.stringify(sortData)) {
    console.log('排序未变')
    return
  }
  const sortMap = {}
  data.forEach((item, index) => {
    item.sort = index + 1
    sortMap[item.id] = item.sort
  })
  emit('sortBookmark', { sortMap: sortMap })
}

</script>

<style lang="less" scoped>
.right-header {
  width: 80%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: auto;
  font-size: 24px;
  .icon-list {
    margin-left: 20px;
    cursor: pointer;
  }
}
.scroll-wrapper {
  height: calc(100% - 40px);
  &.disabled {
    :deep(.el-scrollbar__wrap) {
      overflow: hidden;
    }
  }
  .row-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    width: 80%;
    margin: auto;
    .row-item {
      width: 100%;
      background: #fff;
      padding: 15px 20px;
      margin-bottom: 20px;
      border-radius: 4px;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      text-align: left;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: inherit;
      position: relative;
      user-select: none;
      border: 1px solid #d9ecff;
      .icon {
        width: 20px;
        height: 20px;
      }
      .label {
        margin-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .icon-more {
        position: absolute;
        right: 0px;
        font-size: 26px;
        cursor: pointer;
        opacity: 0.5;
        background: #d5d5d5;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: none;
        &.icon-more-show {
          display: block;
        }
      }
      .icon-move {
        position: absolute;
        right: 10px;
        width: 30px;
        height: 30px;
        cursor: move;
      }
      &:hover {
        background: #d9ecff;
        .icon-more {
          display: block;
        }
      }
      &.acitve {
        background: #d9ecff;
      }
    }
    &.box-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 80%;
      margin: auto;
      .box-item {
        width: calc((100% - 2 * 24px) / 3);
        &.box-item-margin {
          margin-left: 24px;
          margin-right: 24px;
        }
        .icon {
          width: 40px;
          height: 40px;
        }
        .label {
          margin-left: 10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          white-space: initial;
        }
        // .icon-more {
        //   rotate: 90deg;
        //   top: 0;
        //   right: 10px;
        // }
      }
    }
  }
}
.ghost-class {
  border: solid 1px rgb(19, 41, 239) !important;
}
.chosen-class {
  // background-color: #eee !important;
  // opacity: 1;
  // border: solid 1px red;
}
</style>
