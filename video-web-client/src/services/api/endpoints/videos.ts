import ApiClient from '../api.client'
import type { Video } from '../api.types'

class VideoApi {
  readonly videoBaseUrl: string

  constructor() {
    this.videoBaseUrl = '/video'
  }

  public async getVideo(videoId: string) {
    return ApiClient.get<Video>(`${this.videoBaseUrl}/${videoId}`)
  }

  public async getTrendingVideos() {
    return ApiClient.get<Video[]>(`${this.videoBaseUrl}/trending`)
  }

  public async getRecommendedVideosForCurrentVideo(videoId: string) {
    return ApiClient.get<Video[]>(`${this.videoBaseUrl}/${videoId}/recommended`)
  }
}

export default new VideoApi()
