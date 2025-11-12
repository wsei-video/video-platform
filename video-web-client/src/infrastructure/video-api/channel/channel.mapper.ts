import { Channel, type ChannelCreateCommand, type ChannelUpdateCommand } from '@/domain/channel'
import type { PaginatedList } from '@/domain/shared/types'

import type { ChannelCreateDto, ChannelDto, ChannelsDto, ChannelUpdateDto } from '../shared'

export class ChannelMapper {
  public static toModel(dto: ChannelDto): Channel {
    return new Channel(dto.id, dto.name, dto.slug, new Date(dto.createdAt))
  }

  public static toDto(model: Channel): ChannelDto {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      createdAt: model.createdAt.toISOString(),
    }
  }

  public static toCreateDto(c: ChannelCreateCommand): ChannelCreateDto {
    return {
      name: c.name,
      slug: c.slug,
    }
  }

  public static toUpdateDto(c: ChannelUpdateCommand): ChannelUpdateDto {
    return {
      name: c.name,
      slug: c.slug,
    }
  }

  public static toPaginatedModel(dto: ChannelsDto): PaginatedList<Channel> {
    return {
      hasNext: dto.next,
      total: dto.total,
      items: dto.items.map((i) => ChannelMapper.toModel(i)),
    }
  }
}
