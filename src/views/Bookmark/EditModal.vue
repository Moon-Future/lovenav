<template>
  <el-dialog class="editmodal-container" :model-value="dialogVisible" :title="title" width="600px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" v-if="editType === 'modify'">
      <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="网址" prop="url" :label-width="formLabelWidth" v-if="!editData.folder">
        <el-input v-model="form.url" autocomplete="off" />
      </el-form-item>
      <el-form-item class="form-icon" label="图标" :label-width="formLabelWidth" v-if="!editData.folder">
        <el-input v-model="form.icon" autocomplete="off" />
        <img :src="form.icon" alt="" />
      </el-form-item>
    </el-form>
    <div class="move-title" v-if="editType === 'move'">
      将<span :title="editData.label">{{ editData.label }}</span
      >移动到
    </div>
    <el-scrollbar class="edit-scroll" v-if="editType === 'move' || editType === 'add'">
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
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, nextTick } from 'vue'

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
const form = ref({ name: '', url: '', icon: '', folder: '' })
const formRef = ref()
const expandedKeys = ref([])
const editTree = ref()
const selectId = ref('')

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 1000, message: '请输入1~1000个字符', trigger: 'blur' },
  ],
  url: [
    { required: true, message: '请输入网址', trigger: 'blur' },
    { min: 1, max: 1000, message: '请输入1~1000个字符', trigger: 'blur' },
  ],
}

const handleClose = () => {
  console.log('handleClose')
  emit('closeEditModal')
}

// 点击树节点
const handleNodeClick = (treeNode) => {
  console.log(treeNode)
  selectId.value = treeNode.id
}

const handleSave = () => {
  if (props.editType === 'modify') {
    formRef.value.validate((valid, fields) => {
      if (valid) {
        emit('saveEditModal', { form: form.value, editData: props.editData, editType: props.editType })
      } else {
        console.log('error submit!', fields)
      }
    })
  } else {
    emit('saveEditModal', { editData: props.editData, editType: props.editType, selectId: selectId.value })
  }
}

watch(
  () => props.editType,
  (newValue) => {
    const editType = newValue
    const editData = props.editData
    if (editType === '') return
    form.value = { name: editData.label, url: editData.url || '', icon: editData.icon, folder: !!editData.folder }
    if (editData.folder) {
      title.value = editType === 'move' ? '移动文件夹' : '重命名文件夹'
    } else {
      title.value = editType === 'add' ? '添加书签' : editType === 'move' ? '移动书签' : '修改书签'
    }
    formRef.value && formRef.value.resetFields()
    console.log(editData)
    if (editType === 'move' || editType === 'add') {
      nextTick(() => {
        expandedKeys.value = [editData.parent]
        editTree.value.setCurrentKey(editData.parent)
        selectId.value = editData.parent
      })
    }
  }
)
</script>

<style lang="less" scoped>
.editmodal-container {
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
.el-dialog__header {
  text-align: left;
  font-weight: bold;
}
</style>
