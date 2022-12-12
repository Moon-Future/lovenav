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
import { getGlobalProperties } from '@/utils/index'

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
const globalProperties = getGlobalProperties()

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

// 导入书签
const handleChangeFile = (e) => {
  const reader = new FileReader()
  reader.readAsText(e.raw, 'utf8')
  reader.onload = (event) => {
    const { myBookmark, saveData } = handleChromeFile(event.target.result)
    bookmarkData.value = myBookmark
    localStorage.setItem('bookmarkData', JSON.stringify(myBookmark))
    localStorage.setItem('chromeFile', event.target.result)
    saveImportData(saveData)
  }
}

// 点击树结点
const handleNodeClick = ({ treeNode, type }) => {
  selectData.value = treeNode.children || []
  bookmarkRef.value.handleExpandedKeys(treeNode.id, type)
}

// 打开操作菜单
const openOperateMenu = ({ ref, data }) => {
  triggerRef.value = ref
  visiblePopover.value = true
  editData.value = data
  editType.value = ''
}

// 因此操作菜单
const hideOperateMenu = () => {
  triggerRef.value = null
  visiblePopover.value = false
}

// 点击操作菜单选项
const clickOperateItem = (type) => {
  visiblePopover.value = false
  dialogVisible.value = true
  editType.value = type
}

// 关闭修改弹出框
const closeEditModal = () => {
  dialogVisible.value = false
}

// 保存修改数据
const saveEditModal = ({ form, editData, editType }) => {
  console.log(form, editData, editType)
  dialogVisible.value = false
  editData.label = form.name
}

// 提交书签导入数据
const saveImportData = async (data) => {
  try {
    const res = await globalProperties.$api.importBookmark({ bookmarks: data })
    console.log('res', res)
  } catch (e) {
    console.log(e)
  }
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
