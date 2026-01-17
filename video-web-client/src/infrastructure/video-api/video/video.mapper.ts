import type { PaginatedList } from '@/domain/shared/types'
import { Video, type VideoCreateCommand, type VideoUpdateCommand } from '@/domain/video'

import { ChannelMapper } from '../channel/channel.mapper'
import type { VideoCreateDto, VideoDto, VideosDto, VideoUpdateDto } from '../shared'

export class VideoMapper {
  public static toDto(model: Video): VideoDto {
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      thumbnail: model.thumbnail,
      duration: model.duration,
      createdAt: model.createdAt.toISOString(),
      channel: ChannelMapper.toDto(model.channel),
      views: model.views,
      commentCount: model.commentCount,
      progress: model.progress,
      status: model.status,
      reactions: [],
      userReaction: null,
      visibility: model.visibility,
    }
  }
  public static toModel(dto: VideoDto): Video {
    return new Video(
      dto.id,
      dto.title,
      dto.description,
      dto.thumbnail,
      dto.status,
      dto.visibility,
      dto.views,
      dto.duration,
      dto.commentCount,
      dto.progress,
      ChannelMapper.toModel(dto.channel),
      new Date(dto.createdAt),
      dto.reactions,
    )
  }

  public static toUpdateDto(c: VideoUpdateCommand): VideoUpdateDto {
    return {
      description: c.description,
      title: c.title,
      visibility: c.visibility,
    }
  }

  public static toCreateDto(c: VideoCreateCommand): VideoCreateDto {
    return {
      title: c.title,
      channelId: c.channelId,
      description: '',
      visibility: 'private',
    }
  }

  public static toPaginatedModel(dto: VideosDto): PaginatedList<Video> {
    return {
      items: dto.items.map((v) => VideoMapper.toModel(v)),
      hasNext: dto.next,
      total: dto.total,
    }
  }
}
