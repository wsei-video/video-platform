import { CommentReaction, VideoReaction } from '@/domain/reaction'
import type { PaginatedList } from '@/domain/shared/types'

import type {
  VideoCommentReactionDto,
  VideoCommentReactionsDto,
  VideoReactionDto,
  VideoReactionsDto,
} from '../shared'

export class ReactionMapper {
  public static toVideoReactionModel(dto: VideoReactionDto): VideoReaction {
    return new VideoReaction(dto.id, dto.content, new Date(dto.createdAt), dto.userId, dto.videoId)
  }

  public static toPaginatedVideoReactionModel(
    dto: VideoReactionsDto,
  ): PaginatedList<VideoReaction> {
    return {
      items: dto.items.map(ReactionMapper.toVideoReactionModel),
      hasNext: dto.next,
      total: dto.total,
    }
  }

  public static toCommentReactionModel(dto: VideoCommentReactionDto): CommentReaction {
    return new CommentReaction(
      dto.id,
      dto.content,
      new Date(dto.createdAt),
      dto.userId,
      dto.commentId,
    )
  }

  public static toPaginatedCommentReactionModel(
    dto: VideoCommentReactionsDto,
  ): PaginatedList<CommentReaction> {
    return {
      items: dto.items.map(ReactionMapper.toCommentReactionModel),
      hasNext: dto.next,
      total: dto.total,
    }
  }
}
