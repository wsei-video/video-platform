import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';
import { Account } from '@video/lib/database/client';
import { ForbiddenError, ListQuery } from '@video/lib/restful';
import { DateUtils } from '@video/lib/utils';
import { CommentReactionCreateDto } from './reaction.dto';

@Injectable()
export class CommentReactionService {
  public constructor(private readonly database: DatabaseService) {}

  public async listCommentReactions(commentId: number, query: ListQuery) {
    const reactions = await this.database.commentReaction.findMany({
      where: { commentId },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.database.commentReaction.count({ where: { commentId } });
    const next = total > (query.page - 1) * query.count + reactions.length;
    return { items: reactions, total, next };
  }

  public getReaction(commentId: number, reactionId: number) {
    return this.database.commentReaction.findFirstOrThrow({
      where: { id: reactionId, commentId },
    });
  }

  public async getUserReaction(account: Account, commentId: number) {
    return this.database.commentReaction.findFirst({
      where: { commentId, userId: account.id },
    });
  }

  public async reactToComment(account: Account, commentId: number, body: CommentReactionCreateDto) {
    const now = DateUtils.now();

    return this.database.commentReaction.upsert({
      where: {
        userId_commentId: {
          userId: account.id,
          commentId,
        },
      },
      update: {
        content: body.content,
      },
      create: {
        content: body.content,
        commentId,
        userId: account.id,
        createdAt: now,
      },
    });
  }

  public async deleteReaction(account: Account, commentId: number, reactionId: number) {
    await this.verifyReactionOwnership(account, reactionId);

    await this.database.commentReaction.delete({ where: { id: reactionId, commentId } });
  }

  public async deleteUserReaction(account: Account, commentId: number) {
    await this.database.commentReaction.delete({
      where: {
        userId_commentId: {
          userId: account.id,
          commentId,
        },
      },
    });
  }

  public async verifyReactionOwnership(account: Account, reactionId: number) {
    const reaction = await this.database.commentReaction.findFirstOrThrow({ where: { id: reactionId } });

    if (reaction.userId !== account.id) {
      throw new ForbiddenError();
    }
  }
}
