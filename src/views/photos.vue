<script setup>
import { onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'
import usePhotoStore from '../stores/photos'
import PhotosDialog from '../components/dialog.vue'

defineOptions({
  name: 'PhotosPage'
})

const defaultPhoto = {
  title: '',
  url: ''
}

const store = usePhotoStore()
const dialogRef = ref()
const photo = ref({ ...defaultPhoto })

onMounted(() => {
  store.fetchPhotos()
})

async function handleDelete(photo) {
  try {
    await store.deletePhoto(photo)
    ElNotification.success('Photo was deleted successfully!')
  } catch (e) {
    ElNotification.error('Something went wrong, please try again later!')
  }
}

function handleOpenDialog(photo) {
  dialogRef.value?.open(photo)
}
</script>
<template>
  <el-container>
    <el-aside> <PhotosDialog ref="dialogRef" /> </el-aside>
    <el-main>
      <el-row align="middle" justify="space-between">
        <h3>Photos</h3>
        <el-button type="primary" @click="handleOpenDialog()">
          <el-icon><Plus /></el-icon>
          Add
        </el-button>
      </el-row>
      <el-table :data="store.photos">
        <el-table-column prop="id" label="ID" width="100px" />
        <el-table-column prop="title" label="Title" />
        <el-table-column label="Image" width="120px">
            <template v-slot="scope">
                <img :src="scope.row.thumbnailUrl" style="width:100px; height: 100px;"/>
            </template>
        </el-table-column>
        <el-table-column prop="actions" label="Actions" width="200px">
          <template #default="{ row: photo }">
            <el-button type="warning" @click="handleOpenDialog(photo)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" @click="handleDelete(photo)">
              <el-icon><DeleteFilled /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
