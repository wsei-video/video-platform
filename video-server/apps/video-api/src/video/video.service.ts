import { Injectable } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { DatabaseService } from '@video/lib/database';
import { DateUtils } from '@video/lib/utils';
import { ListQuery } from '@video/lib/restful';

import { ChannelService } from '../channel/channel.service';
import { VideoCommonService } from './video-common.service';
import { VideoCreateDto, VideoUpdateDto } from './video.dto';

@Injectable()
export class VideoService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly channelService: ChannelService,
    private readonly videoCommonService: VideoCommonService,
  ) {}

  public async updateVideo(account: Account, videoId: number, body: VideoUpdateDto) {
    await this.verifyAccountVideoPermission(account, videoId);
    await this.database.video.update({ where: { id: videoId }, data: body });
    return await this.findById(account, videoId);
  }

  public async getRecommendedVideos(account: Account | null, videoId: number, query: ListQuery) {
    const videos = await this.database.video.findMany({
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    const total = await this.database.video.count();
    const next = total > (query.page - 1) * query.count + videos.length;
    return { items: videos, total, next };
  }

  public async deleteVideo(account: Account, videoId: number) {
    await this.verifyAccountVideoPermission(account, videoId);

    await this.database.video.delete({ where: { id: videoId } });
  }

  public async findById(account: Account | null, videoId: number) {
    const video = await this.database.video.findFirstOrThrow({
      where: { id: videoId },
      include: {
        channel: true,
        _count: { select: { comments: true } },
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.videoCommonService.aggregateVideoReactions([video.id]);

    return {
      ...video,
      commentCount: video._count.comments,
      reactions: reactions.get(video.id) ?? [],
      userReaction: video.reactions?.[0] ?? null,
    };
  }

  public async createVideo(account: Account, body: VideoCreateDto) {
    await this.channelService.verifyAccountChannelPermissions(account, body.channelId.clear);

    const video = await this.database.video.create({
      data: {
        title: body.title,
        channelId: body.channelId.clear,
        createdAt: DateUtils.now(),
      },
      include: {
        channel: true,
      },
    });

    return {
      ...video,
      commentCount: 0,
      reactions: [],
      userReaction: null,
    };
  }

  public async verifyAccountVideoPermission(account: Account, videoId: number) {
    const video = await this.database.video.findFirstOrThrow({ where: { id: videoId } });
    await this.channelService.verifyAccountChannelPermissions(account, video.channelId);
  }
}
