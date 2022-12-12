<template>
  <div class="bookmark-container">
    <div class="header-container">
      <span>书签栏</span>
      <el-upload ref="upload" class="upload-file" action="" :limit="1" :show-file-list="false" :on-change="handleChangeFile" :auto-upload="false">
        <template #trigger>
          <span>导入书签</span>
        </template>
      </el-upload>
    </div>
    <div class="bookmark-content">
      <div class="bookmark-left">
        <BookmarkTree
          :bookmarkData="bookmarkData"
          @nodeClick="handleNodeClick"
          @openOperateMenu="openOperateMenu"
          @hideOperateMenu="hideOperateMenu"
          ref="bookmarkRef"
        />
      </div>
      <div class="bookmark-right">
        <RightContent :bookmarkData="selectData" :visiblePopover="visiblePopover" @nodeClick="handleNodeClick" @openOperateMenu="openOperateMenu" />
      </div>
    </div>
    <el-popover
      ref="popoverRef"
      :visible="visiblePopover"
      :virtual-ref="triggerRef"
      :hide-after="0"
      :popper-class="visiblePopover ? 'popper-wrapper' : 'popper-wrapper popper-hide'"
      placement="bottom-start"
      trigger="click"
      virtual-triggering
    >
      <div class="menu-list">
        <div class="menu-item" v-for="(item, index) in menuList" :key="index" @click="clickOperateItem(item.type)">{{ item.name }}</div>
      </div>
    </el-popover>
    <EditModal
      :dialogVisible="dialogVisible"
      :bookmarkData="bookmarkData"
      :editData="editData"
      :editType="editType"
      @closeEditModal="closeEditModal"
      @saveEditModal="saveEditModal"
    />
  </div>
</template>

<script setup>
import BookmarkTree from '@/components/BookmarkTree'
import RightContent from '@/views/Bookmark/RightContent'
import EditModal from '@/views/Bookmark/EditModal'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { nanoid } from 'nanoid'
import { handleChromeFile } from '@/utils/handleData'

const bookmarkData = ref([])
const selectData = ref([])
const bookmarkRef = ref()
const triggerRef = ref()
const popoverRef = ref()
const visiblePopover = ref(false)
const dialogVisible = ref(false)
const editData = ref({})
const editType = ref('')
const menuList = ref([
  { name: '修改', type: 'modify' },
  { name: '移动', type: 'move' },
  { name: '删除', type: 'remove' },
])

onMounted(() => {
  const localData = localStorage.getItem('bookmarkData')
  const chromeFile = localStorage.getItem('chromeFile')
  if (localData) {
    bookmarkData.value = JSON.parse(localData)
  }
  if (chromeFile) {
    handleChromeFile(chromeFile)
  }
  window.addEventListener('click', clickListener)
})

onUnmounted(() => {
  window.removeEventListener('click', clickListener)
})

const clickListener = (e) => {
  const path = e.path
  for (let i = 0, len = path.length; i < len; i++) {
    if (path[i] === popoverRef.value.popperRef.contentRef) return
  }
  hideOperateMenu()
}

const handleChangeFile = (e) => {
  const reader = new FileReader()
  reader.readAsText(e.raw, 'utf8')
  reader.onload = (event) => {
    const doms = document.createElement('html')
    doms.innerHTML = event.target.result
    // const formDatas = walkBookmarkTree(doms)
    const formDatas = handleChromeFile(event.target.result)
    bookmarkData.value = [formDatas]
    localStorage.setItem('bookmarkData', JSON.stringify([formDatas]))
    localStorage.setItem('chromeFile', event.target.result)
  }
}

const walkBookmarkTree = (root) => {
  const result = [] // 深度优先遍历
  const walk = (node, list) => {
    const els = node.children
    if (els && els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        const item = els[i] // p标签或h3标签直接跳过
        if (item.tagName === 'P' || item.tagName === 'H3') {
          continue
        } // 文件夹不用创建元素
        if (item.tagName === 'DL') {
          walk(els[i], list)
        } else {
          // DT节点
          let child = null // 判断是否是文件夹
          const children = item.children
          let isDir = false
          for (let j = 0; j < children.length; j++) {
            if (children[j].tagName === 'H3' || children[j].tagName === 'DL') {
              isDir = true
            }
          } // 文件夹
          if (isDir) {
            child = {
              label: item.tagName === 'DT' ? (item.querySelector('h3') ? item.querySelector('h3').innerText : '') : '',
              folder: true,
              children: [],
              id: nanoid(10),
            }
            walk(els[i], child.children)
          } else {
            // 书签
            const _item = item.querySelector('a')
            if (_item) {
              child = {
                label: _item?.innerText,
                url: _item?.href,
                icon: _item?.getAttribute('ICON'),
                id: nanoid(10),
              }
            }
          }
          child && list.push(child)
        }
      }
    }
  }
  walk(root, result)
  //过滤不为 folder的书签，保证书签能够识别
  // const myBookmark = result.filter((v) => v.folder)
  const bookmark = result[0].children
  const myBookmark = bookmark[0]
  myBookmark.children = myBookmark.children || []
  for (let i = 1; i < bookmark.length; i++) {
    myBookmark.children.push(bookmark[i])
  }
  return myBookmark
}

const handleNodeClick = ({ treeNode, type }) => {
  selectData.value = treeNode.children || []
  bookmarkRef.value.handleExpandedKeys(treeNode.id, type)
}

const openOperateMenu = ({ ref, data }) => {
  triggerRef.value = ref
  visiblePopover.value = true
  editData.value = data
  editType.value = ''
}

const hideOperateMenu = () => {
  triggerRef.value = null
  visiblePopover.value = false
}

const clickOperateItem = (type) => {
  visiblePopover.value = false
  dialogVisible.value = true
  editType.value = type
}

const closeEditModal = () => {
  dialogVisible.value = false
}

const saveEditModal = ({ form, editData, editType }) => {
  console.log(form, editData, editType)
  dialogVisible.value = false
  editData.label = form.name
}
</script>

<style lang="less" scoped>
.bookmark-container {
  height: 100%;
  .header-container {
    height: 48px;
    border-bottom: 1px solid #eee;
    padding: 20px;
    display: flex;
    align-items: center;
    border-radius: 6px 6px 0 0;
    .upload-file {
      // position: absolute;
      // bottom: 0;
      // width: 100%;
      // height: 28px;
      display: flex;
      padding: 10px;
      font-size: 14px;
    }
  }
  .bookmark-content {
    display: flex;
    height: calc(100% - 48px);
  }
  .bookmark-left {
    width: 250px;
    // height: calc(100% - 48px);
    border-right: 1px solid #eee;
    position: relative;
    text-align: left;
  }
  .bookmark-right {
    background: #eee;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
.menu-list {
  display: flex;
  flex-direction: column;
  .menu-item {
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
      background: #ecf5ff;
    }
  }
}
</style>
<style>
.popper-wrapper {
  width: 100px !important;
  min-width: 100px !important;
  padding: 5px 0 !important;
}
.popper-hide {
  top: -1000px !important;
}
</style>
