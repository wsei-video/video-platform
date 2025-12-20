import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';
import { Account } from '@video/lib/database/client';
import { ForbiddenError, ListQuery } from '@video/lib/restful';
import { DateUtils } from '@video/lib/utils';
import {
  VideoCommentCreateDto,
  VideoCommentReplyCreateDto,
  VideoCommentReplyUpdateDto,
  VideoCommentUpdateDto,
} from './video-comment.dto';
import { ReactionAggregateDto } from '../reaction/reaction.dto';

@Injectable()
export class VideoCommentService {
  public constructor(private readonly database: DatabaseService) {}

  public async listVideoComments(account: Account | null, videoId: number, query: ListQuery) {
    const comments = await this.database.comment.findMany({
      where: { videoId, parentId: null },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      include: {
        _count: { select: { replies: true } },
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.aggregateCommentsReactions(comments.map(comment => comment.id));
    const total = await this.database.comment.count({ where: { videoId, parentId: null } });
    const next = total > (query.page - 1) * query.count + comments.length;

    return {
      items: comments.map(comment => ({
        ...comment,
        replyCount: comment._count.replies,
        reactions: reactions.get(comment.id) ?? [],
        userReaction: comment.reactions?.[0] ?? null,
      })),
      total,
      next,
    };
  }

  public async findComment(account: Account | null, videoId: number, commentId: number) {
    const comment = await this.database.comment.findFirstOrThrow({
      where: { id: commentId, videoId },
      include: {
        _count: { select: { replies: true } },
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.aggregateCommentsReactions([comment.id]);

    return {
      ...comment,
      replyCount: comment._count.replies,
      reactions: reactions.get(comment.id) ?? [],
      userReaction: comment.reactions?.[0] ?? null,
    };
  }

  public async createComment(account: Account, videoId: number, body: VideoCommentCreateDto) {
    const comment = await this.database.comment.create({
      data: {
        content: body.content,
        videoId,
        userId: account.id,
        createdAt: DateUtils.now(),
      },
    });

    return {
      ...comment,
      replyCount: 0,
      reactions: [],
      userReaction: null,
    };
  }

  public async updateComment(account: Account, videoId: number, commentId: number, body: VideoCommentUpdateDto) {
    await this.verifyCommentOwnership(account, commentId);

    const comment = await this.database.comment.update({
      where: { id: commentId, videoId },
      data: {
        content: body.content,
        updatedAt: DateUtils.now(),
      },
      include: {
        _count: { select: { replies: true } },
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.aggregateCommentsReactions([comment.id]);

    return {
      ...comment,
      replyCount: comment._count.replies,
      reactions: reactions.get(comment.id) ?? [],
      userReaction: comment.reactions?.[0] ?? null,
    };
  }

  public async deleteComment(account: Account, videoId: number, commentId: number) {
    await this.verifyCommentOwnership(account, commentId);
    await this.database.comment.delete({ where: { id: commentId, videoId } });
  }

  public async deleteCommentReply(account: Account, videoId: number, commentId: number, replyId: number) {
    await this.verifyCommentOwnership(account, replyId);
    await this.database.comment.delete({ where: { id: replyId, parentId: commentId, videoId } });
  }

  public async updateCommentReply(
    account: Account,
    videoId: number,
    commentId: number,
    replyId: number,
    body: VideoCommentReplyUpdateDto,
  ) {
    await this.verifyCommentOwnership(account, replyId);

    const reply = await this.database.comment.update({
      where: { id: replyId, parentId: commentId, videoId },
      data: {
        content: body.content,
        updatedAt: DateUtils.now(),
      },
      include: {
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.aggregateCommentsReactions([reply.id]);

    return {
      ...reply,
      commentId: reply.parentId,
      reactions: reactions.get(reply.id) ?? [],
      userReaction: reply.reactions?.[0] ?? null,
    };
  }

  public async createCommentReply(
    account: Account,
    videoId: number,
    commentId: number,
    body: VideoCommentReplyCreateDto,
  ) {
    await this.database.comment.findFirstOrThrow({ where: { id: commentId, videoId } });

    const reply = await this.database.comment.create({
      data: {
        content: body.content,
        videoId,
        userId: account.id,
        parentId: commentId,
        createdAt: DateUtils.now(),
      },
    });

    return {
      ...reply,
      commentId: reply.parentId,
      reactions: [],
      userReaction: null,
    };
  }

  public async findCommentReply(account: Account | null, videoId: number, commentId: number, replyId: number) {
    const reply = await this.database.comment.findFirstOrThrow({
      where: { id: replyId, parentId: commentId, videoId },
      include: {
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.aggregateCommentsReactions([reply.id]);

    return {
      ...reply,
      commentId: reply.parentId,
      reactions: reactions.get(reply.id) ?? [],
      userReaction: reply.reactions?.[0] ?? null,
    };
  }

  public async listCommentReplies(account: Account | null, videoId: number, commentId: number, query: ListQuery) {
    const replies = await this.database.comment.findMany({
      where: { videoId, parentId: commentId },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      include: {
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.aggregateCommentsReactions(replies.map(reply => reply.id));
    const total = await this.database.comment.count({ where: { videoId, parentId: commentId } });
    const next = total > (query.page - 1) * query.count + replies.length;

    return {
      items: replies.map(reply => ({
        ...reply,
        commentId: reply.parentId,
        reactions: reactions.get(reply.id) ?? [],
        userReaction: reply.reactions?.[0] ?? null,
      })),
      total,
      next,
    };
  }

  private async verifyCommentOwnership(account: Account, commentId: number) {
    const comment = await this.database.comment.findFirstOrThrow({ where: { id: commentId } });
    if (comment.userId !== account.id) throw new ForbiddenError();
  }

  private async aggregateCommentsReactions(commentIds: number[]) {
    const reactions = await this.database.commentReaction.groupBy({
      by: ['commentId', 'content'],
      where: {
        commentId: { in: commentIds },
      },
      _count: {
        content: true,
      },
      orderBy: [
        {
          _count: {
            content: 'desc',
          },
        },
      ],
    });

    const reactionsByCommentId = new Map<number, ReactionAggregateDto[]>();

    for (const reaction of reactions) {
      const list = reactionsByCommentId.get(reaction.commentId) ?? [];
      list.push({ content: reaction.content, count: reaction._count.content });
      reactionsByCommentId.set(reaction.commentId, list);
    }

    return reactionsByCommentId;
  }
}
