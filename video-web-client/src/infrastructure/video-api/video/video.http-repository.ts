import type { AxiosInstance } from 'axios'

import type { PaginatedList, PaginationOptions } from '@/domain/shared/types'
import type { Video, VideoSource, VideoUploadSource } from '@/domain/video'
import type { VideoCreateCommand, VideoUpdateCommand } from '@/domain/video'
import type { VideoRepository } from '@/domain/video/video.repository'

import type {
  MediaStreamsDto,
  VideoDto,
  VideosDto,
  VideoSourceDto,
  VideoUploadSourceDto,
} from '../shared'
import { VideoMapper } from './video.mapper'
import { VideoSourceMapper } from './video-source.mapper'

export default class HttpVideoRepository implements VideoRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly baseUrl: string = '/v1/videos',
  ) {}

  async fetchVideo(videoId: string): Promise<Video> {
    const res = await this.httpClient.get<VideoDto>(`${this.baseUrl}/${videoId}`)
    const video: Video = VideoMapper.toModel(res.data)
    return video
  }

  async fetchVideoSource(videoId: string): Promise<VideoSource> {
    const res = await this.httpClient.get<VideoSourceDto>(`${this.baseUrl}/${videoId}/source`)
    const source = VideoSourceMapper.toModel(res.data)
    return source
  }

  async fetchRecommendedVideosForVideo(
    videoId: string,
    page: number = 1,
    count: number = 20,
  ): Promise<PaginatedList<Video>> {
    const res = await this.httpClient.get<VideosDto>(`${this.baseUrl}/${videoId}/recommended`, {
      params: {
        page,
        count,
      },
    })
    return VideoMapper.toPaginatedModel(res.data)
  }

  async createVideo(command: VideoCreateCommand): Promise<Video> {
    const dto = VideoMapper.toCreateDto(command)
    const res = await this.httpClient.post<VideoDto>(`${this.baseUrl}`, {
      ...dto,
    })
    return VideoMapper.toModel(res.data)
  }

  async getUploadUrl(videoId: string): Promise<VideoUploadSource> {
    const res = await this.httpClient.put<VideoUploadSourceDto>(`${this.baseUrl}/${videoId}/source`)
    return res.data
  }

  async updateVideo(command: VideoUpdateCommand): Promise<Video> {
    const dto = VideoMapper.toUpdateDto(command)
    const res = await this.httpClient.patch<VideoDto>(`${this.baseUrl}/${command.videoId}`, dto)
    return VideoMapper.toModel(res.data)
  }

  async deleteVideo(videoId: string): Promise<void> {
    await this.httpClient.delete(`${this.baseUrl}/${videoId}`)
  }

  async getTrendingVideos(options: PaginationOptions): Promise<PaginatedList<Video>> {
    const res = await this.httpClient.get<VideosDto>(`/v1/video/feed/trending`, {
      params: {
        page: options.page,
        count: options.count,
      },
    })
    const model = VideoMapper.toPaginatedModel(res.data)
    return model
  }
  async getMostPopularVideos(options: PaginationOptions): Promise<PaginatedList<Video>> {
    const res = await this.httpClient.get<VideosDto>(`/v1/video/feed/most-popular`, {
      params: {
        page: options.page,
        count: options.count,
      },
    })
    return VideoMapper.toPaginatedModel(res.data)
  }
  async getRecentlyUploadedVideos(options: PaginationOptions): Promise<PaginatedList<Video>> {
    const res = await this.httpClient.get<VideosDto>(`/v1/video/feed/recently-uploaded`, {
      params: {
        page: options.page,
        count: options.count,
      },
    })
    return VideoMapper.toPaginatedModel(res.data)
  }
  async getForYouVideos(options: PaginationOptions): Promise<PaginatedList<Video>> {
    const res = await this.httpClient.get<VideosDto>(`/v1/video/feed/for-you`, {
      params: {
        page: options.page,
        count: options.count,
      },
    })
    return VideoMapper.toPaginatedModel(res.data)
  }

  async getMediaStreams(videoId: string): Promise<MediaStreamsDto> {
    const res = await this.httpClient.get<MediaStreamsDto>(`/v1/videos/${videoId}/streams`)
    return res.data
  }
}
