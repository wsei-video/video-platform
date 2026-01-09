import { VideoUtils } from '@/infrastructure/video-api/shared/utils'

import type { Channel } from '../channel/channel.model'
import { BadRequest } from '../shared/error'
import type { VideoUpdateCommand } from './video.commands'

export type VideoStatus = 'none' | 'processing' | 'successful' | 'failed'
export type VideoVisibility = 'private' | 'public' | 'unlisted'
export type VideoUploadSource = {
  resumableUploadUrl: string
  simpleUploadUrl: string
}

export class Video {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public hlsUrl: string,
    public thumbnail: string,
    public status: VideoStatus,
    public visibility: VideoVisibility,
    public views: number,
    public duration: number,
    public commentCount: number,
    public channel: Channel,
    public createdAt: Date,
  ) {}

  public isPublic() {
    return this.visibility === 'public'
  }

  get formattedUploadDate(): string {
    return VideoUtils.formatDate(this.createdAt)
  }

  get timeSinceUpload(): string {
    return VideoUtils.formatTimeSince(this.createdAt)
  }

  get formattedDuration(): string {
    return VideoUtils.formatDuration(this.duration)
  }

  get formattedViews(): string {
    return VideoUtils.formatCount(this.views)
  }

  get formattedViewsCompact(): string {
    return VideoUtils.formatCountCompact(this.views)
  }

  get canBePublished(): boolean {
    if (!this.description || !this.hlsUrl || !this.thumbnail || this.status !== 'successful')
      return false

    return true
  }

  public validateUpdate(c: VideoUpdateCommand): Error | void {
    if (!this.description && !c.description && c.visibility === 'public')
      throw new BadRequest({}, 'You have to provide video description publish video')
    if (c.title === '') throw new BadRequest({}, 'Video has to have a title')
  }
}
