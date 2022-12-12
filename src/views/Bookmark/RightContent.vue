<template>
  <div class="right-header" v-show="bookmarkData.length">
    <svg-icon class="icon-list" iconName="icon-liebiao" :color="listType === 'list' ? '#409eff' : '#8c8c8c'" @click="changeType('list')" />
    <svg-icon class="icon-list" iconName="icon-liebiao1" :color="listType === 'box' ? '#409eff' : '#8c8c8c'" @click="changeType('box')" />
  </div>
  <el-scrollbar class="scroll-wrapper" :class="{ disabled: visiblePopover }">
    <draggable
      class="row-list"
      :class="{ 'box-list': listType === 'box' }"
      :list="bookmarkData"
      delay="200"
      group="people"
      item-key="id"
      ghost-class="ghost-class"
      chosen-class="chosen-class"
      :force-fallback="true"
      animation="300"
      @start="drag = true"
      @end="drag = false"
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
          <svg-icon
            class="icon-more"
            :class="{ 'icon-more-show': moreShow === element.id && visiblePopover }"
            iconName="icon-more"
            :ref="(ref) => (refMap[element.id] = ref)"
            @click.stop="handleMore(element)"
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
          <svg-icon
            class="icon-more"
            :class="{ 'icon-more-show': moreShow === element.id && visiblePopover }"
            iconName="icon-more"
            :ref="(ref) => (refMap[element.id] = ref)"
            @click.stop.prevent="handleMore(element)"
          />
        </a>
      </template>
    </draggable>
  </el-scrollbar>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import draggable from 'vuedraggable'

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

const emit = defineEmits(['nodeClick', 'openOperateMenu'])

const listType = ref('list')
const refMap = ref({})
const moreShow = ref('')

const changeType = (type) => {
  listType.value = type
}

const handleClick = (item) => {
  if (item.folder) {
    emit('nodeClick', { treeNode: item, type: 'expand' })
  }
}

const handleMore = (item) => {
  moreShow.value = item.id
  emit('openOperateMenu', { ref: refMap.value[item.id], data: item })
}

const onDargStart = () => {
  console.log('onDargStart')
}

const onDargEnd = () => {
  console.log('onDargEnd')
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
    /deep/ .el-scrollbar__wrap {
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
