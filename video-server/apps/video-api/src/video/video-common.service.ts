import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';

import { ReactionAggregateDto } from '../reaction/reaction.dto';

@Injectable()
export class VideoCommonService {
  public constructor(private readonly database: DatabaseService) {}

  public async aggregateVideoReactions(videoIds: number[]) {
    const reactions = await this.database.videoReaction.groupBy({
      by: ['videoId', 'content'],
      where: {
        videoId: { in: videoIds },
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

    const reactionsByVideoId = new Map<number, ReactionAggregateDto[]>();

    for (const reaction of reactions) {
      const list = reactionsByVideoId.get(reaction.videoId) ?? [];
      list.push({ content: reaction.content, count: reaction._count.content });
      reactionsByVideoId.set(reaction.videoId, list);
    }

    return reactionsByVideoId;
  }
}
