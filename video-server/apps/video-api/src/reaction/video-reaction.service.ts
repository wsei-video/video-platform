import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';
import { Account } from '@video/lib/database/client';
import { ForbiddenError, ListQuery } from '@video/lib/restful';
import { DateUtils } from '@video/lib/utils';
import { VideoReactionCreateDto } from './reaction.dto';

@Injectable()
export class VideoReactionService {
  public constructor(private readonly database: DatabaseService) {}

  public async listVideoReactions(videoId: number, query: ListQuery) {
    const reactions = await this.database.videoReaction.findMany({
      where: { videoId },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    const total = await this.database.videoReaction.count({ where: { videoId } });
    const next = total > (query.page - 1) * query.count + reactions.length;
    return { items: reactions, total, next };
  }

  public getReaction(videoId: number, reactionId: number) {
    return this.database.videoReaction.findFirstOrThrow({
      where: { id: reactionId, videoId },
    });
  }

  public async getUserReaction(account: Account, videoId: number) {
    return this.database.videoReaction.findFirst({
      where: { videoId, userId: account.id },
    });
  }

  public async reactToVideo(account: Account, videoId: number, body: VideoReactionCreateDto) {
    const now = DateUtils.now();

    return this.database.videoReaction.upsert({
      where: {
        userId_videoId: {
          userId: account.id,
          videoId,
        },
      },
      update: {
        content: body.content,
      },
      create: {
        content: body.content,
        videoId,
        userId: account.id,
        createdAt: now,
      },
    });
  }

  public async deleteReaction(account: Account, videoId: number, reactionId: number) {
    await this.verifyReactionOwnership(account, reactionId);

    await this.database.videoReaction.delete({ where: { id: reactionId, videoId } });
  }

  public async deleteUserReaction(account: Account, videoId: number) {
    await this.database.videoReaction.delete({
      where: {
        userId_videoId: {
          userId: account.id,
          videoId,
        },
      },
    });
  }

  public async verifyReactionOwnership(account: Account, reactionId: number) {
    const reaction = await this.database.videoReaction.findFirstOrThrow({ where: { id: reactionId } });

    if (reaction.userId !== account.id) {
      throw new ForbiddenError();
    }
  }
}
