import { Comment, type CommentCreateCommand, type CommentUpdateCommand } from '@/domain/comment'
import { BadRequest } from '@/domain/shared/error'
import type { PaginatedList } from '@/domain/shared/types'

import { AccountMapper } from '../auth'
import { ReactionMapper } from '../reaction/reaction.mapper'
import type {
  VideoCommentCreateDto,
  VideoCommentDto,
  VideoCommentsDto,
  VideoCommentUpdateDto,
} from '../shared'

export class CommentMapper {
  public static toModel(dto: VideoCommentDto): Comment {
    if (!dto.videoId) {
      throw new BadRequest({}, 'Comment in DTO is missing videoId')
    }
    return new Comment(
      dto.id,
      dto.content,
      AccountMapper.toModel(dto.user),
      dto.videoId,
      dto.replyCount,
      new Date(dto.createdAt),
      dto.updatedAt ? new Date(dto.updatedAt) : null,
      dto.reactions,
      dto.userReaction ? ReactionMapper.toCommentReactionModel(dto.userReaction) : null,
    )
  }

  public static toUpdateDto(c: CommentUpdateCommand): VideoCommentUpdateDto {
    return {
      content: c.content,
    }
  }

  public static toCreateDto(c: CommentCreateCommand): VideoCommentCreateDto {
    return {
      content: c.content,
    }
  }

  public static toPaginatedModel(dto: VideoCommentsDto): PaginatedList<Comment> {
    return {
      items: dto.items.map(CommentMapper.toModel),
      hasNext: dto.next,
      total: dto.total,
    }
  }
}
