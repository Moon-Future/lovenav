<template>
  <div class="bookmark-container">
    <div class="header-container">
      <span class="header-title">书签栏</span>
      <span class="header-desc">书签，只用一个就够了</span>
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
        <div class="bookmark-btngrp">
          <el-button type="primary" size="small" @click="addNewBookmark">添加书签</el-button>
          <el-button type="primary" size="small" @click="addNewFolder">新建目录</el-button>
          <el-upload ref="upload" class="upload-file" action="" :limit="1" :show-file-list="false" :on-change="handleChangeFile" :auto-upload="false">
            <template #trigger>
              <el-button type="primary" size="small">导入书签</el-button>
            </template>
          </el-upload>
        </div>
      </div>
      <div class="bookmark-right">
        <RightContent
          :bookmarkData="selectData"
          :visiblePopover="visiblePopover"
          @nodeClick="handleNodeClick"
          @openOperateMenu="openOperateMenu"
          @sortBookmark="saveSortBookmark"
        />
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
import { ElMessage, ElMessageBox } from 'element-plus'

const bookmarkData = ref([])
const bookmarkMap = ref({})
const selectData = ref([])
const selectDataParentId = ref('')
const bookmarkRef = ref()
const triggerRef = ref()
const popoverRef = ref()
const visiblePopover = ref(false)
const dialogVisible = ref(false)
const editData = ref({})
const editType = ref('')
const menuList = ref([
  // { name: '添加书签', type: 'modify' },
  // { name: '新建目录', type: 'modify' },
  { name: '修改', type: 'modify' },
  { name: '移动', type: 'move' },
  { name: '删除', type: 'remove' },
])
const globalProperties = getGlobalProperties()

onMounted(() => {
  // const localData = localStorage.getItem('bookmarkData')
  // const chromeFile = localStorage.getItem('chromeFile')
  // if (localData) {
  //   bookmarkData.value = JSON.parse(localData)
  // }
  // if (chromeFile) {
  //   handleChromeFile(chromeFile)
  // }
  window.addEventListener('click', clickListener)
  getBookmark()
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
  selectDataParentId.value = treeNode.parent
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
  if (type === 'remove') {
    removeBookmark()
  } else {
    dialogVisible.value = true
    editType.value = type
  }
}

// 关闭修改弹出框
const closeEditModal = () => {
  dialogVisible.value = false
  editType.value = ''
}

// 保存修改数据
const saveEditModal = async ({ form, editData, editType, selectId, selectNode }) => {
  dialogVisible.value = false
  switch (editType) {
    case 'move':
      moveBookmark({ editData, selectId })
      break
    case 'modify':
      modifyBookmark({ form, editData })
      break
    case 'addNewFolder':
      saveNewNode({ editData, form, selectId, selectNode, folderStatus: true })
      break
    case 'addNewBookmark':
      saveNewNode({ editData, form, selectId, selectNode, folderStatus: false })
      break
    default:
      break
  }
}

// 修改书签
const modifyBookmark = async ({ form, editData }) => {
  if (form.name === editData.label && form.url === editData.url && form.icon === editData.icon) return
  try {
    editData.label = form.name
    const saveData = {
      id: editData.id,
      name: form.name,
      url: form.url,
      icon: form.icon,
      folder: editData.folder,
    }
    const res = await globalProperties.$api.modifyBookmark({ bookmark: saveData })
  } catch (e) {
    console.log(e)
  }
}

// 移动书签
const moveBookmark = async ({ editData, selectId }) => {
  if (selectId === editData.parent || selectId === editData.id) return
  try {
    const moveData = {
      id: editData.id,
      folder: editData.folder,
    }
    const res = await globalProperties.$api.moveBookmark({ bookmark: moveData, parentID: selectId })
    if (res.status === 1) {
      const parent = editData.parent

      editData.parent = selectId
      bookmarkMap.value[selectId].children.push(editData)
      if (editData.folder) {
        bookmarkMap.value[selectId].folderChildren.push(editData)
      }
      
      const children = parent ? bookmarkMap.value[parent].children : bookmarkData.value
      const moveIndex = children.findIndex((item) => item.id === editData.id)
      children.splice(moveIndex, 1)
      if (moveData.folder && selectDataParentId.value === parent) {
        selectData.value = []
      }
      const folderChildren = parent ? bookmarkMap.value[parent].folderChildren : bookmarkData.value
      const moveFolderIndex = folderChildren.findIndex((item) => item.id === editData.id)
      folderChildren.splice(moveFolderIndex, 1)
    }
  } catch (e) {
    console.log(e)
  }
}

// 删除书签
const removeBookmark = () => {
  ElMessageBox.confirm('数据删除不可恢复，确认是否删除？', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const deleteData = editData.value
      const res = await globalProperties.$api.removeBookmark({ bookmark: { id: deleteData.id, folder: deleteData.folder } })
      if (res.status === 1) {
        const parent = deleteData.parent
        const children = parent ? bookmarkMap.value[parent].children : bookmarkData.value
        const deleteIndex = children.findIndex((item) => item.id === deleteData.id)
        children.splice(deleteIndex, 1)
        if (deleteData.folder && selectDataParentId.value === parent) {
          selectData.value = []
        }
        const folderChildren = parent ? bookmarkMap.value[parent].folderChildren : bookmarkData.value
        const moveFolderIndex = folderChildren.findIndex((item) => item.id === deleteData.id)
        folderChildren.splice(moveFolderIndex, 1)
      }
    })
    .catch(() => {})
}

// 新建目录/书签保存
const saveNewNode = async ({ form, selectId, selectNode, folderStatus }) => {
  try {
    const id = nanoid(10)
    const name = folderStatus ? form.folderName : form.name
    const res = await globalProperties.$api.saveNewNode({ parentID: selectId, id: id, name: name, url: form.url, icon: form.icon, folderStatus: folderStatus })
    if (res.status === 1) {
      const newNode = {
        id,
        label: name,
        url: form.url,
        icon: folderStatus ? '' : res.data.icon,
        sort: res.data.sort,
        parent: selectId,
        folder: folderStatus
      }
      if (folderStatus) {
        newNode.children = []
        newNode.folderChildren = []
      }
      selectNode.children.push(newNode)
      if (folderStatus) {
        selectNode.folderChildren.push(newNode)
      }
      bookmarkMap.value[id] = newNode
    }
  } catch (e) {
    console.log(e)
  }
}

// 新建目录
const addNewFolder = () => {
  editData.value = { parent: bookmarkData.value.length ? bookmarkData.value[0].id : '', folderName: '' }
  dialogVisible.value = true
  editType.value = 'addNewFolder'
}

// 新建书签
const addNewBookmark = () => {
  editData.value = { parent: bookmarkData.value.length ? bookmarkData.value[0].id : '' }
  dialogVisible.value = true
  editType.value = 'addNewBookmark'
}

// 保存排序数据
const saveSortBookmark = async ({ sortMap, cancelSort }) => {
  if (cancelSort) {
    selectData.value.sort((a, b) => {
      return a.sort - b.sort
    })
    return
  }
  try {
    const res = await globalProperties.$api.sortBookmark({ sortMap })
    if (res.status === 1) {
      selectData.value.forEach((item) => {
        item.sort = sortMap[item.id]
      })
      const temp = [].concat(bookmarkData.value)
      bookmarkData.value = []
      bookmarkData.value = temp
    } else {
      selectData.value.sort((a, b) => {
        return a.sort - b.sort
      })
    }
  } catch (e) {
    console.log(e)
    selectData.value.sort((a, b) => {
      return a.sort - b.sort
    })
  }
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

// 获取书签树
const getBookmark = async () => {
  try {
    const res = await globalProperties.$api.getBookmark({ userId: '' })
    console.log('getBookmark', res)
    handleBookmarkData(res.data)
  } catch (e) {
    console.log(e)
  }
}

// 处理书签列表为树结构
const handleBookmarkData = (data) => {
  const dataMap = {}
  const treeData = []
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    const { id, web_name, web_url, icon_url, parent_id, folder_status, sort_number } = item
    const node = { id, label: web_name, url: web_url, icon: icon_url, parent: parent_id, folder: !!folder_status, sort: sort_number }
    if (dataMap[id]) {
      // 如果先循环到子级是创建了对象
      dataMap[id] = { ...node, ...dataMap[id] }
    } else {
      dataMap[id] = node
      if (folder_status) {
        node.children = []
        node.folderChildren = []
      }
    }
    if (!parent_id) {
      // 顶层节点
      treeData.push(dataMap[id])
    } else {
      // 先循环到子级，创建父级对象
      if (!dataMap[parent_id]) {
        dataMap[parent_id] = { children: [], folderChildren: [] }
      }
      dataMap[parent_id].children.push(dataMap[id])
      folder_status && dataMap[parent_id].folderChildren.push(dataMap[id])
    }
  }
  for (let key in dataMap) {
    const item = dataMap[key]
    if (item.children) {
      item.children.sort((a, b) => {
        return a.sort - b.sort
      })
      item.folderChildren.sort((a, b) => {
        return a.sort - b.sort
      })
    }
  }
  treeData.sort((a, b) => {
    return a.sort - b.sort
  })
  console.log('treeData', treeData, bookmarkData.value)
  bookmarkData.value = treeData
  bookmarkMap.value = dataMap
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
    .header-title {
      font-size: 20px;
      font-weight: bold;
    }
    .header-desc {
      margin-left: 20px;
      margin-top: 4px;
      font-size: 16px;
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
    .bookmark-btngrp {
      height: 40px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #eee;
      button {
        margin: 0;
      }
    }
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
