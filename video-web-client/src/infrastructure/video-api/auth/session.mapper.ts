import type { AuthSessionDto, AuthSessionsDto } from '@/infrastructure/video-api/shared'

import { Session } from '../../../domain/auth/session.model'
import type { PaginatedList } from '../../../domain/shared/types'

export class SessionMapper {
  public static toModel(dto: AuthSessionDto): Session {
    return new Session(
      dto.id,
      dto.device,
      dto.browser,
      new Date(dto.lastAccessAt),
      new Date(dto.createdAt),
    )
  }

  public static toDto(model: Session): AuthSessionDto {
    return {
      id: model.id,
      browser: model.browser,
      device: model.device,
      createdAt: model.createdAt.toISOString(),
      lastAccessAt: model.lastAccessAt.toISOString(),
    }
  }

  public static toPaginatedModel(dto: AuthSessionsDto): PaginatedList<Session> {
    return {
      hasNext: dto.next,
      total: dto.total,
      items: dto.items.map((i) => SessionMapper.toModel(i)),
    }
  }
}
