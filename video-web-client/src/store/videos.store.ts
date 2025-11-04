import { defineStore } from 'pinia'
import { VideoApi } from '@/services/api'

// to be removed - call api client directly inside composable

export const useVideosStore = defineStore('videos', () => {
  async function fetchTrendingVideos() {
    try {
      const response = await VideoApi.fetchTrendingVideos()
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchVideo(videoId: string) {
    try {
      const response = await VideoApi.fetchVideo(videoId)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchRecommendedVideos(videoId: string) {
    try {
      const response = await VideoApi.getRecommendedVideosForCurrentVideo(videoId)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  return {
    fetchTrendingVideos,
    fetchRecommendedVideos,
    fetchVideo,
  }
})
