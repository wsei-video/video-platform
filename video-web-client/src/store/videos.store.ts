import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { type Video, VideoApi } from '@/services/api'

export const useVideosStore = defineStore('videos', () => {
  const _videos = ref<Video[]>([])
  const getVideos = computed(() => _videos.value)

  async function getTrendingVideos() {
    try {
      const response = await VideoApi.getTrendingVideos()
      _videos.value = response.data
    } catch (error) {
      console.log(error)
    }
  }

  return {
    getTrendingVideos,
    getVideos,
  }
})
