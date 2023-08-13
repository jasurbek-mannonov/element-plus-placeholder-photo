<script setup>
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'
import usePhotoStore from '../stores/photos'

import { Check, Close } from '@element-plus/icons-vue'

defineOptions({
  name: 'PhotosDialog'
})

const defaultPhoto = {
  title: '',
  completed: true
}

const drawer = ref(false)
const formRef = ref()
const store = usePhotoStore()
const photo = ref({ ...defaultPhoto })

function open(u) {
  drawer.value = true
  if (!u) {
    // yangi photo create
    photo.value = { ...defaultPhoto }
  } else {
    //{} edit qilish
    photo.value = { ...u }
  }
}

function handleClose() {
  formRef.value.resetFields()
  drawer.value = false
}

async function handleCreate() {
  await store.createPhoto(photo.value)
  ElNotification.success('Photo created successfully!')
}

async function handleUpdate() {
  await store.updatePhoto(photo.value)
  ElNotification.success('Photo was edited successfully!')
}

async function handleSave() {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    if (photo.value.id) {
      await handleUpdate()
    } else {
      await handleCreate()
    }

    handleClose()
  } catch (e) {
    console.log(e)
    ElNotification.error('Something went wrong, please, try again later!')
  }
}

const rules = ref({
  title: [{ required: true }],
  thumbnailUrl: [{ required: true }]
})

const drawerTitle = computed(() => {
  return photo.value.id ? 'Edit Photo' : 'Create Photo'
})

defineExpose({
  open
})
console.log(photo)
</script>

<template>
  <el-drawer v-model="drawer" :title="drawerTitle" :before-close="handleClose">
    <el-form label-position="top" :rules="rules" :model="photo" ref="formRef">
      <el-form-item label="Title" prop="title">
        <el-input v-model="photo.title" />
      </el-form-item>
      <el-form-item label="Image" prop="thumbnailUrl">
        <el-input v-model="photo.thumbnailUrl" />
      </el-form-item>
      <!-- <el-upload list-type="picture-card" :auto-upload="false">
    <el-icon><Plus /></el-icon>
    <template #defalt="{ row: photo }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="photo.thumbnailUrl" />
      </div>
    </template>
  </el-upload> -->
      <el-button type="success" @click="handleSave">
        <el-icon><Select /></el-icon>
        Save
      </el-button>
      <el-button type="danger" @click="handleClose">
        <el-icon><Close /></el-icon>
        Cancel
      </el-button>
    </el-form>
  </el-drawer>
</template>
