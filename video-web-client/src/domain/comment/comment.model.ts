import { VideoUtils } from '@/infrastructure/video-api/shared/utils'

import type { Account } from '../account/account.model'
import type { CommentReaction, ReactionAggregate } from '../reaction'

export class Comment {
  constructor(
    public id: string,
    public content: string,
    public user: Account,
    public videoId: string,
    public replyCount: number,
    public createdAt: Date,
    public updatedAt: Date | null,
    public reactions: ReactionAggregate[],
    public userReaction: CommentReaction | null,
  ) {}

  get timeSinceAdded(): string {
    return VideoUtils.formatTimeSince(this.createdAt)
  }
}
