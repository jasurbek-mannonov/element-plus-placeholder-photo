import http from '../utils/http'
import { defineStore } from 'pinia'

const usePhotoStore = defineStore('photos', {
  state: () => ({
    photos: []
  }),
  actions: {
    async fetchPhotos() {
      try {
        const { data } = await http.get('/photos', {
            params: {
                _sort: 'id',
                _order: 'title'
            }
        })
        this.photos = data
        return data
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async createPhoto(photo) {
      try {
        const { data } = await http.post('photos', photo)
        this.fetchPhotos()
        return data
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async updatePhoto(photo) {
      try {
        const { data } = await http.put(`photos/${photo.id}`, photo)
        const index = this.photos.findIndex((u) => u.id === photo.id)
        if (index === -1) return
        this.photos.splice(index, 1, { ...photo })
        return data
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async deletePhoto(photo) {
      try {
        await http.delete(`/photos/${photo.id}`)

        const index = this.photos.findIndex((u) => u.id === photo.id)
        if (index === -1) return
        this.photos.splice(index, 1)
        return photo
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
})

export default usePhotoStore
