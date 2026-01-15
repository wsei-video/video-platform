import { Injectable } from '@nestjs/common';

import { Config } from '@video/lib/config';
import { DatabaseService } from '@video/lib/database';
import { Id } from '@video/lib/restful';
import { VideoThumbnail } from '@video/lib/database/client';

import { ImageDto } from './video.dto';
import { ReactionAggregateDto } from '../reaction/reaction.dto';

@Injectable()
export class VideoCommonService {
  public constructor(
    private readonly config: Config,
    private readonly database: DatabaseService,
  ) {}

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

  public serializeThumbnailToImage(thumbnail: VideoThumbnail | null): ImageDto | null {
    if (!thumbnail) return null;

    const baseUrl = `${this.config.video.cdnUrl}/media/${Id.clear(thumbnail.videoId).encrypted}/image/thumbnail`;
    return {
      id: thumbnail.id,
      variants: thumbnail.variants
        .split(',')
        .map(variant => variant.split('x'))
        .map(([width, height]) => ({
          width: Number(width),
          height: Number(height),
          url: `${baseUrl}/${thumbnail.name}_${height}p.jpg`,
        })),
    };
  }
}
