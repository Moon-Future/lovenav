<template>
  <div class="right-header" v-show="bookmarkData.length">
    <svg-icon class="icon-list" iconName="icon-liebiao" :color="listType === 'list' ? '#409eff' : '#8c8c8c'" @click="changeType('list')" />
    <svg-icon class="icon-list" iconName="icon-liebiao1" :color="listType === 'box' ? '#409eff' : '#8c8c8c'" @click="changeType('box')" />
  </div>
  <el-scrollbar class="scroll-wrapper">
    <div class="row-list" :class="{ 'box-list': listType === 'box' }">
      <template v-for="(item, index) in bookmarkData" :key="index">
        <div
          class="row-item"
          :class="{ 'box-item': listType === 'box', 'box-item-margin': (index + 2) % 3 === 0 }"
          @click="handleClick(item)"
          v-if="item.folder"
        >
          <svg-icon class="icon" iconName="icon-folder" v-if="item.folder" />
          <img class="icon" :src="item.icon" alt="" v-else-if="item.icon" />
          <svg-icon class="icon" iconName="icon-website" v-else />
          <span class="label" :title="item.label">{{ item.label }}</span>
          <svg-icon class="icon-more" iconName="icon-more" @click.stop="handleMore" />
        </div>
        <a
          class="row-item"
          :class="{ 'box-item': listType === 'box', 'box-item-margin': (index + 2) % 3 === 0 }"
          :href="item.url"
          target="_blank"
          @click="handleClick(item)"
          v-else
        >
          <svg-icon class="icon" iconName="icon-folder" v-if="item.folder" />
          <img class="icon" :src="item.icon" alt="" v-else-if="item.icon" />
          <svg-icon class="icon" iconName="icon-website" v-else />
          <span class="label" :title="item.label">{{ item.label }}</span>
          <svg-icon class="icon-more" iconName="icon-more" @click.prevent="handleMore" />
        </a>
      </template>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'

const props = defineProps({
  bookmarkData: {
    typeof: Array,
    default() {
      return []
    },
  },
})

const emit = defineEmits(['nodeClick'])

const listType = ref('list')

const changeType = (type) => {
  listType.value = type
}

const handleClick = (item) => {
  console.log('item', item)
  if (item.folder) {
    emit('nodeClick', { treeNode: item })
  }
}

const handleMore = () => {
  console.log('handleMore')
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
</style>
