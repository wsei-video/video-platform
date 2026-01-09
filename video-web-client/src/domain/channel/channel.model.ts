import { VideoUtils } from '@/infrastructure/video-api/shared/utils'

import { BadRequest } from '../shared/error'
import type { ChannelUpdateCommand } from './channel.commands'
export class Channel {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public createdAt: Date,
  ) {}

  get formattedCreationDate(): string {
    return VideoUtils.formatDate(this.createdAt)
  }

  public validateUpdate(c: ChannelUpdateCommand): Error | void {
    if (!c.name && !c.slug) throw new BadRequest({}, 'You have to fill at least one field')
  }
}
