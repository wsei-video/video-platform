import type { Account } from '../account/account.model'
import type { CommentReaction, ReactionAggregate } from '../reaction'

export class CommentReply {
  constructor(
    public id: string,
    public content: string,
    public user: Account,
    public videoId: string,
    public commentId: string,
    public createdAt: Date,
    public updatedAt: Date | null,
    public reactions: ReactionAggregate[],
    public userReaction: CommentReaction | null,
  ) {}
}