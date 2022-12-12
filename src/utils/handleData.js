import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

// 深度优先遍历
const walkChromeDomTree = (root) => {
  const result = [] 
  const saveData = [] // 存入数据库数据
  const walk = (node, list, folderList, parentId) => {
    const els = node.children
    if (els && els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        const item = els[i]
        // p标签或h3标签直接跳过
        if (item.tagName === 'P' || item.tagName === 'H3') {
          continue
        }
        // 文件夹不用创建元素
        if (item.tagName === 'DL') {
          walk(item, list, folderList, parentId)
        } else {
          // DT节点
          let child = null // 判断是否是文件夹
          const children = item.children
          let isDir = false
          for (let j = 0; j < children.length; j++) {
            if (children[j].tagName === 'H3' || children[j].tagName === 'DL') {
              isDir = true
              break
            }
          } // 文件夹
          const id = nanoid(10)
          if (isDir) {
            child = {
              label: item.tagName === 'DT' ? (item.querySelector('h3') ? item.querySelector('h3').innerText : '') : '',
              folder: true,
              children: [],
              folderChildren: [],
              id: id,
              parentId: parentId,
            }
            walk(item, child.children, child.folderChildren, id)
            folderList.push(child)
          } else {
            // 书签
            const _item = item.querySelector('a')
            if (_item) {
              child = {
                label: _item?.innerText,
                url: _item?.href,
                icon: _item?.getAttribute('ICON'),
                id: id,
                parentId: parentId,
              }
            }
          }
          if (child) {
            list.push(child)
            saveData.push({ id, parentId, label: child.label, folder: isDir, parentId, url: child.url || '', icon: child.icon })
          }
        }
      }
    }
  }
  walk(root, result, [], '')
  console.log(result)
  const bookmark = result[0].children
  const myBookmark = bookmark[0]
  myBookmark.parentId = ''
  myBookmark.children = myBookmark.children || []
  for (let i = 1; i < bookmark.length; i++) {
    bookmark[i].parentId = myBookmark.id
    myBookmark.children.push(bookmark[i])
  }
  return myBookmark
}

// 广度优先遍历
const bfsDChromeDomTree = (root) => {
  const result = []
  const queue = []
  const saveData = {} // 存入数据库数据
  const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const emojiReg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
  queue.push({ node: root, data: result, folderData: [], parentId: '' })
  while (queue.length !== 0) {
    let len = queue.length
    for (let i = 0; i < len; i++) {
      const obj = queue.shift()
      const currNode = obj.node.children || []
      const arr = obj.data
      const folderData = obj.folderData
      const parentId = obj.parentId
      for (let j = 0; j < currNode.length; j++) {
        const item = currNode[j]
        // p标签或h3标签直接跳过
        if (item.tagName === 'P' || item.tagName === 'H3') {
          continue
        }
        // 文件夹
        if (item.tagName === 'DL') {
          queue.push({ node: item, data: arr, folderData, parentId })
        } else {
          // DT节点
          let child = null // 判断是否是文件夹
          const children = item.children
          let isDir = false
          for (let k = 0; k < children.length; k++) {
            if (children[k].tagName === 'H3' || children[k].tagName === 'DL') {
              isDir = true
              break
            }
          }
          // 文件夹
          const id = nanoid(10)
          if (isDir) {
            child = {
              label: (item.tagName === 'DT' ? (item.querySelector('h3') ? item.querySelector('h3').innerText : '') : '').replace(emojiReg, ''),
              folder: true,
              children: [],
              folderChildren: [],
              id: id,
              parentId,
              sort: j
            }
            folderData.push(child)
            queue.push({ node: item, data: child.children, folderData: child.folderChildren, parentId: id })
          } else {
            // 书签
            const _item = item.querySelector('a')
            if (_item) {
              child = {
                label: _item?.innerText.replace(emojiReg, ''),
                url: _item?.href,
                icon: _item?.getAttribute('ICON'),
                id: id,
                parentId,
                sort: j
              }
            }
          }
          if (child) {
            arr.push(child)
            if (child.label) {
              saveData[id] = { id, parentId, label: child.label, folder: isDir, url: child.url || '', icon: child.icon || '', sort: child.sort, createTime }
            }
          }
        }
      }
    }
  }
  const children = result[0].children
  const firstObj = children[0]
  const myBookmark = []
  firstObj.parentId = ''
  myBookmark.push(firstObj)
  const id = nanoid(10)
  if (children.length > 1) {
    const secondObj = { label: '其他书签', folder: true, id, parentId: '', sort: firstObj.sort + 1, children: [], folderChildren: [] }
    saveData[id] = { id, parentId: '', label: secondObj.label, folder: true, url: '', icon: '', sort: secondObj.sort, createTime }
    for (let i = 1, len = children.length; i < len; i++) {
      const item = children[i]
      item.parentId = id
      secondObj.children.push(item)
      item.folder && secondObj.folderChildren.push(item)
      saveData[item.id].parentId = id
    }
    myBookmark.push(secondObj)
  }
  return { myBookmark, saveData }
}

export function handleChromeFile(fileContent) {
  const doms = document.createElement('html')
  doms.innerHTML = fileContent
  // const { myBookmark, saveData } = bfsDChromeDomTree(doms)
  return bfsDChromeDomTree(doms)
  // bookmarkData.value = [formDatas]
  // localStorage.setItem('bookmarkData', JSON.stringify([formDatas]))
}
