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
        <BookmarkTree :bookmarkData="bookmarkData" @nodeClick="handleNodeClick" />
      </div>
      <div class="bookmark-right">
        <RightContent :bookmarkData="selectData" @nodeClick="handleNodeClick" />
      </div>
    </div>
  </div>
</template>

<script setup>
import BookmarkTree from '@/components/BookmarkTree'
import RightContent from '@/views/Bookmark/RightContent'
import { onMounted, ref } from 'vue'

const bookmarkData = ref([])
const selectData = ref([])

onMounted(() => {
  const localData = localStorage.getItem('bookmarkData')
  if (localData) {
    bookmarkData.value = JSON.parse(localData)
  }
})

const handleChangeFile = (e) => {
  const reader = new FileReader()
  reader.readAsText(e.raw, 'utf8')
  reader.onload = (event) => {
    const doms = document.createElement('html')
    doms.innerHTML = event.target.result
    const formDatas = walkBookmarkTree(doms)
    bookmarkData.value = [formDatas]
    localStorage.setItem('bookmarkData', JSON.stringify([formDatas]))
  }
}

const walkBookmarkTree = (root) => {
  const result = [] // 深度优先遍历
  let index = 0
  const walk = (node, list) => {
    const els = node.children
    if (els && els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        index++
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
              id: index,
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
                id: index,
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

const handleNodeClick = ({ treeNode }) => {
  selectData.value = treeNode.children || []
}
</script>

<style lang="less" scoped>
.bookmark-container {
  height: 100%;
  .header-container {
    height: 48px;
    border: 1px solid #eee;
    padding: 20px;
    display: flex;
    align-items: center;
    .upload-file {
      // position: absolute;
      // bottom: 0;
      // width: 100%;
      // height: 28px;
      display: flex;
      padding: 10px;
      border-top: 1px solid #eee;
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
</style>
