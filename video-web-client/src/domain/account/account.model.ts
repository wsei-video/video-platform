import { VideoUtils } from '@/infrastructure/video-api/shared/utils'

import type { Channel } from '../channel/channel.model'

export class Account {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public createdAt: Date,
    public channels: Channel[] = [],
  ) {}

  get formattedCreationDate(): string {
    return VideoUtils.formatDate(this.createdAt)
  }
}
