import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';
import { Account } from '@video/lib/database/client';
import { ForbiddenError, ListQuery } from '@video/lib/restful';
import { DateUtils } from '@video/lib/utils';
import { VideoCommentCreateDto, VideoCommentUpdateDto } from './video-comment.dto';

@Injectable()
export class VideoCommentService {
  public constructor(private readonly database: DatabaseService) {}

  private readonly commentInclude = {
    replies: { include: { reactions: true } },
    reactions: true,
  };

  public async listVideoComments(videoId: number, query: ListQuery) {
    const comments = await this.database.comment.findMany({
      where: { videoId, parentId: null },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: { createdAt: 'desc' },
      include: this.commentInclude,
    });

    const total = await this.database.comment.count({ where: { videoId, parentId: null } });
    const next = total > (query.page - 1) * query.count + comments.length;
    return { items: comments, total, next };
  }

  public getComment(videoId: number, commentId: number) {
    return this.database.comment.findFirstOrThrow({
      where: { id: commentId, videoId },
      include: this.commentInclude,
    });
  }

  public commentVideo(account: Account, videoId: number, body: VideoCommentCreateDto) {
    const now = DateUtils.now();
    return this.database.comment.create({
      data: {
        content: body.content,
        videoId,
        userId: account.id,
        createdAt: now,
      },
      include: this.commentInclude,
    });
  }

  public async replyToComment(account: Account, videoId: number, parentId: number, body: VideoCommentCreateDto) {
    await this.database.comment.findFirstOrThrow({ where: { id: parentId, videoId } });

    const now = DateUtils.now();
    return this.database.comment.create({
      data: {
        content: body.content,
        videoId,
        userId: account.id,
        parentId,
        createdAt: now,
      },
      include: this.commentInclude,
    });
  }

  public async updateComment(account: Account, videoId: number, commentId: number, body: VideoCommentUpdateDto) {
    await this.verifyCommentOwnership(account, commentId);

    const now = DateUtils.now();
    return this.database.comment.update({
      where: { id: commentId, videoId },
      data: {
        content: body.content,
        updatedAt: now,
      },
      include: this.commentInclude,
    });
  }

  public async deleteComment(account: Account, videoId: number, commentId: number) {
    await this.verifyCommentOwnership(account, commentId);

    await this.database.comment.delete({ where: { id: commentId, videoId } });
  }

  public async verifyCommentOwnership(account: Account, commentId: number) {
    const comment = await this.database.comment.findFirstOrThrow({ where: { id: commentId } });

    if (comment.userId !== account.id) {
      throw new ForbiddenError();
    }
  }
}
