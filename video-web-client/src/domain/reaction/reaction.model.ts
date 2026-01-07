export class VideoReaction {
  constructor(
    public id: string,
    public content: string,
    public createdAt: Date,
    public userId: string,
    public videoId: string
  ) {}
}

export class CommentReaction {
  constructor(
    public id: string,
    public content: string,
    public createdAt: Date,
    public userId: string,
    public commentId: string
  ) {}
}

export type UserReaction = VideoReaction | CommentReaction

export interface ReactionAggregate {
  content: string
  count: number
}