import type { PaginatedList, PaginationOptions } from '../shared/types'
import type { VideoCreateCommand, VideoUpdateCommand } from './video.commands'
import type { Video, VideoUploadSource } from './video.model'
import type { VideoSource } from './video-source.model'

export interface VideoRepository {
  fetchVideo(videoId: string): Promise<Video>
  fetchVideoSource(videoId: string): Promise<VideoSource>
  fetchRecommendedVideosForVideo(
    videoId: string,
    page: number,
    count: number,
  ): Promise<PaginatedList<Video>>
  createVideo(command: VideoCreateCommand): Promise<Video>
  getUploadUrl(videoId: string): Promise<VideoUploadSource>
  updateVideo(command: VideoUpdateCommand): Promise<Video>
  deleteVideo(videoId: string): Promise<void>
  getTrendingVideos(pageOptions: PaginationOptions): Promise<PaginatedList<Video>>
  getMostPopularVideos(pageOptions: PaginationOptions): Promise<PaginatedList<Video>>
  getRecentlyUploadedVideos(pageOptions: PaginationOptions): Promise<PaginatedList<Video>>
  getForYouVideos(pageOptions: PaginationOptions): Promise<PaginatedList<Video>>
}
