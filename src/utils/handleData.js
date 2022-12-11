import { nanoid } from 'nanoid'

const walkChromeDomTree = (root) => {
  const result = [] // 深度优先遍历
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
              parentId: parentId
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
                parentId: parentId
              }
            }
          }
          child && list.push(child)
        }
      }
    }
  }
  walk(root, result, [], '')
  const bookmark = result[0].children
  const myBookmark = bookmark[0]
  myBookmark.parentId = ''
  myBookmark.children = myBookmark.children || []
  for (let i = 1; i < bookmark.length; i++) {
    bookmark[i].parentId = myBookmark.id
    myBookmark.children.push(bookmark[i])
  }
  console.log('myBookmark', myBookmark)
  return myBookmark
}

export function handleChromeFile(fileContent) {
  const doms = document.createElement('html')
  doms.innerHTML = fileContent
  const formDatas = walkChromeDomTree(doms)
  return formDatas
  console.log('handleChromeFile')
  // bookmarkData.value = [formDatas]
  // localStorage.setItem('bookmarkData', JSON.stringify([formDatas]))
}
