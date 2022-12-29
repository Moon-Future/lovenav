<template>
  <el-dialog class="editmodal-container" :model-value="dialogVisible" :title="title" width="600px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" v-if="editType === 'modify' || editType === 'addNewFolder' || editType === 'addNewBookmark'">
      <el-form-item
        :class="{ 'form-url': editType === 'addNewBookmark' }"
        label="网址"
        prop="url"
        :label-width="formLabelWidth"
        v-if="!editData.folder && editType !== 'addNewFolder'"
      >
        <el-input v-model="form.url" autocomplete="off" />
        <el-button type="primary" size="small" :loading="loading" @click="getWebInfo" v-if="editType === 'addNewBookmark'">获取标题</el-button>
      </el-form-item>
      <el-form-item label="名称" prop="name" :label-width="formLabelWidth" v-if="editType !== 'addNewFolder'">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item class="form-icon" label="图标" :label-width="formLabelWidth" v-if="!editData.folder && editType !== 'addNewFolder'">
        <el-input v-model="form.icon" autocomplete="off" />
        <img :src="form.icon" alt="" />
      </el-form-item> -->
      <el-form-item label="名称" prop="folderName" :label-width="formLabelWidth" v-if="editType === 'addNewFolder'">
        <el-input v-model="form.folderName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div class="move-title" v-if="editType === 'move'">
      将<span :title="editData.label">{{ editData.label }}</span
      >移动到
    </div>
    <el-scrollbar class="edit-scroll" v-if="editType === 'move' || editType === 'addNewFolder' || editType === 'addNewBookmark'">
      <el-tree
        class="bookmark-tree"
        ref="editTree"
        node-key="id"
        :data="bookmarkData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeys"
        @node-click="handleNodeClick"
        highlight-current
      >
        <template v-slot="{ node, data }">
          <div class="tree-node-item">
            <svg-icon iconName="icon-folder" v-if="data.folder" />
            <img :src="data.icon" alt="" v-else-if="data.icon" />
            <svg-icon iconName="icon-website" v-else />
            <span class="tree-label" :title="node.label" v-if="data.folder">{{ node.label }}</span>
            <a :href="data.url" class="tree-label" :title="node.label" target="_blank" rel="noopener noreferrer" v-else>{{ node.label }}</a>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button class="btn-add" plain v-if="editType === 'move' || editType === 'add'">新建目录</el-button> -->
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
// import axios from 'axios'
import { getGlobalProperties } from '@/utils/index'
import axios from 'axios'

const props = defineProps({
  dialogVisible: {
    typeof: Boolean,
    default: false,
  },
  bookmarkData: {
    typeof: Array,
    default() {
      return []
    },
  },
  editData: {
    typeof: Array,
    default() {
      return {}
    },
  },
  editType: 'modify', // 修改:modify, 移动:move, 新增:add
})

const defaultProps = {
  children: 'folderChildren',
  label: 'label',
}

const emit = defineEmits(['closeEditModal', 'saveEditModal'])
const formLabelWidth = '60px'
const title = ref('')
const form = ref({ name: '', url: '', icon: '', folderName: '', desc: '' })
const formRef = ref()
const expandedKeys = ref([])
const editTree = ref()
const selectId = ref('')
const selectNode = ref({})
const globalProperties = getGlobalProperties()
const loading = ref(false)

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 1000, message: '请输入1~1000个字符', trigger: 'blur' },
  ],
  url: [
    { required: true, message: '请输入网址', trigger: 'blur' },
    { min: 1, max: 1000, message: '请输入1~1000个字符', trigger: 'blur' },
  ],
  folderName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 1000, message: '请输入1~1000个字符', trigger: 'blur' },
  ],
}

const handleClose = () => {
  emit('closeEditModal')
}

// 点击树节点
const handleNodeClick = (treeNode) => {
  selectId.value = treeNode.id
  selectNode.value = treeNode
}

const handleSave = () => {
  if (props.editType !== 'move') {
    formRef.value.validate((valid, fields) => {
      if (valid) {
        // 修改，新建目录
        emit('saveEditModal', {
          form: form.value,
          editData: props.editData,
          editType: props.editType,
          selectId: selectId.value,
          selectNode: selectNode.value,
        })
      } else {
        console.log('error submit!', fields)
      }
    })
  } else {
    // 移动
    emit('saveEditModal', { editData: props.editData, editType: props.editType, selectId: selectId.value })
  }
}

// 获取网站标题和图标
const getWebInfo = async () => {
  if (form.value.url === '') return
  loading.value = true
  try {
    const titleRes = await globalProperties.$api.getTitle({ url: form.value.url })
    if (titleRes.code === 200) {
      form.value.name = titleRes.data.title
      form.value.desc = titleRes.data.description
    } else {
      globalProperties.$message({
        message: '获取失败，请确认地址是否正确或自行输入',
        type: 'warning',
        duration: 1500,
      })
    }
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}

watch(
  () => props.editType,
  (newValue) => {
    const editType = newValue
    const editData = props.editData
    if (editType === '') return
    form.value = { name: editData.label, url: editData.url || '', icon: editData.icon, folder: !!editData.folder, folderName: editData.folderName }
    if (editData.folder) {
      title.value = editType === 'move' ? '移动目录' : '重命名目录'
    } else {
      switch (editType) {
        case 'addNewBookmark':
          title.value = '添加书签'
          break
        case 'addNewFolder':
          title.value = '新建目录'
          break
        case 'move':
          title.value = '移动书签'
          break
        case 'modify':
          title.value = '修改书签'
          break
        default:
          break
      }
    }
    formRef.value && formRef.value.resetFields()
    if (editType === 'move' || editType === 'addNewFolder' || editType === 'addNewBookmark') {
      nextTick(() => {
        expandedKeys.value = [editData.parent]
        editTree.value.setCurrentKey(editData.parent)
        selectId.value = editData.parent
        selectNode.value = editType === 'addNewFolder' || editType === 'addNewBookmark' ? props.bookmarkData[0] : {}
      })
    }
  }
)
</script>

<style lang="less" scoped>
.editmodal-container {
  .form-url {
    .el-input {
      width: 80%;
      margin-right: 10px;
    }
  }
  .form-icon {
    .el-input {
      width: 90%;
      margin-right: 10px;
    }
    img {
      width: 16px;
      height: 16px;
    }
  }
  .move-title {
    text-align: left;
    display: flex;
    span {
      font-weight: bold;
      max-width: 80%;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0 4px;
    }
  }
  .btn-add {
    position: absolute;
    left: 20px;
  }
}
.edit-scroll {
  height: 300px;
  border: 1px solid #eee;
  :deep(.bookmark-tree) {
    > .el-tree-node {
      display: inline-block;
      min-width: 100%;
    }
    .is-current > .el-tree-node__content {
      background-color: #d9ecff;
    }
    .tree-node-item {
      display: flex;
      align-items: center;
    }
    .tree-label {
      margin-left: 8px;
      color: inherit;
    }
  }
}
</style>
<style lang="less">
.editmodal-container {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-dialog__header {
  text-align: left;
  font-weight: bold;
}
</style>
