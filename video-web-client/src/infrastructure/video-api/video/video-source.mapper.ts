import { BadRequest } from '@/domain/shared/error'
import { VideoSource } from '@/domain/video'

import { AccountMapper } from '../auth'
import type { VideoSourceDto } from '../shared'

export class VideoSourceMapper {
  public static toDto(model: VideoSource): VideoSourceDto {
    return {
      name: model.name,
      size: model.size,
      url: model.url,
      user: AccountMapper.toDto(model.user),
    }
  }

  public static toModel(dto: VideoSourceDto): VideoSource {
    if (!dto.user) throw new BadRequest('Uploaded video has to have a user')
    return new VideoSource(dto.name, dto.size, dto.url, AccountMapper.toModel(dto.user))
  }
}
