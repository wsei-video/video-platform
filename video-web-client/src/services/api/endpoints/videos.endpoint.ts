import ApiClient from '../api.client'
import type { Video } from '../api.types'

class VideoApi {
  readonly videoBaseUrl: string

  constructor() {
    this.videoBaseUrl = '/video'
  }

  public async fetchVideo(videoId: string) {
    return ApiClient.get<Video>(`${this.videoBaseUrl}/${videoId}`)
  }

  public async fetchTrendingVideos() {
    return ApiClient.get<Video[]>(`${this.videoBaseUrl}/trending`)
  }

  public async fetchMostPopularVideos() {
    return ApiClient.get<Video[]>(`${this.videoBaseUrl}/most-popular`)
  }

  public async fetchRecentlyUploadedVideos() {
    return ApiClient.get<Video[]>(`${this.videoBaseUrl}/recently-uploaded`)
  }

  public async fetchForYouVideos(userId: string) {
    return ApiClient.get<Video[]>(`${this.videoBaseUrl}/for-you/${userId}`)
  }

  public async getRecommendedVideosForCurrentVideo(videoId: string) {
    return ApiClient.get<Video[]>(`${this.videoBaseUrl}/${videoId}/recommended`)
  }
}

export default new VideoApi()
