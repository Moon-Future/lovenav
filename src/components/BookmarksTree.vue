<template>
  <div class="bookmarks-container">
    <div class="bookmarks-left">
      <el-scrollbar class="bookmarks-wrapper">
        <el-tree v-if="bookmarksData.length" class="bookmarks-tree" :data="bookmarksData" :props="defaultProps" @node-click="handleNodeClick">
          <template v-slot="{ node, data }">
            <svg-icon iconName="icon-folder" v-if="data.folder" />
            <img :src="data.icon" alt="" v-else-if="data.icon" />
            <svg-icon iconName="icon-website" v-else />
            <span class="tree-label">{{ node.label }}</span>
          </template>
        </el-tree>
      </el-scrollbar>
      <el-upload ref="upload" class="upload-file" action="" :limit="1" :show-file-list="false" :on-change="handleChangeFile" :auto-upload="false">
        <template #trigger>
          <span>导入书签</span>
        </template>
      </el-upload>
    </div>
    <div class="bookmarks-right"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
let bookmarksData = ref([])
const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleNodeClick = (e) => {
  console.log('handleNodeClick', e)
}

const handleChangeFile = (e) => {
  const reader = new FileReader()
  reader.readAsText(e.raw, 'utf8')
  reader.onload = (event) => {
    // const bookmarks = event.target.result.replace(/<DT>/g, '')
    const doms = document.createElement('html')
    doms.innerHTML = event.target.result
    const formDatas = walkBookmarksTree(doms)
    console.log('formDatas', formDatas)
    bookmarksData.value = [formDatas]
  }
}

const walkBookmarksTree = (root) => {
  const result = [] // 深度优先遍历
  let index = 1
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
              index,
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
  const bookmarks = result[0].children
  const myBookmarks = bookmarks[0]
  myBookmarks.children = myBookmarks.children || []
  for (let i = 1; i < bookmarks.length; i++) {
    myBookmarks.children.push(bookmarks[i])
  }
  return myBookmarks
}
</script>

<style lang="less" scoped>
.bookmarks-container {
  display: flex;
  .bookmarks-left {
    width: 250px;
    height: 100%;
    border-right: 1px solid #eee;
    position: relative;
    text-align: left;
    .upload-file {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 28px;
      display: flex;
      padding: 10px;
      border-top: 1px solid #eee;
      font-size: 14px;
    }
    .bookmarks-wrapper {
      height: calc(100% - 28px);
      padding: 10px;
      /deep/ .bookmarks-tree {
        > .el-tree-node {
          display: inline-block;
          width: 100%;
        }
        .tree-label {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
