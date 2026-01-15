import {
  CommentReply,
  type CommentReplyCreateCommand,
  type CommentReplyUpdateCommand,
} from '@/domain/comment'
import { BadRequest } from '@/domain/shared/error'
import type { PaginatedList } from '@/domain/shared/types'

import { AccountMapper } from '../auth'
import { ReactionMapper } from '../reaction/reaction.mapper'
import type {
  VideoCommentRepliesDto,
  VideoCommentReplyCreateDto,
  VideoCommentReplyDto,
  VideoCommentReplyUpdateDto,
} from '../shared'

export class CommentReplyMapper {
  public static toModel(dto: VideoCommentReplyDto): CommentReply {
    if (!dto.videoId || !dto.commentId) {
      throw new BadRequest({}, 'Comment reply in DTO is missing videoId or commentId')
    }
    return new CommentReply(
      dto.id,
      dto.content,
      AccountMapper.toModel(dto.user),
      dto.videoId,
      dto.commentId,
      new Date(dto.createdAt),
      dto.updatedAt ? new Date(dto.updatedAt) : null,
      dto.reactions,
      dto.userReaction ? ReactionMapper.toCommentReactionModel(dto.userReaction) : null,
    )
  }

  public static toUpdateDto(c: CommentReplyUpdateCommand): VideoCommentReplyUpdateDto {
    return {
      content: c.content,
    }
  }

  public static toCreateDto(c: CommentReplyCreateCommand): VideoCommentReplyCreateDto {
    return {
      content: c.content,
    }
  }

  public static toPaginatedModel(dto: VideoCommentRepliesDto): PaginatedList<CommentReply> {
    return {
      items: dto.items.map(CommentReplyMapper.toModel),
      hasNext: dto.next,
      total: dto.total,
    }
  }
}
