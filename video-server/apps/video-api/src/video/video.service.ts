import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';
import { VideoCreateDto, VideoUpdateDto } from './video.dto';
import { DateUtils } from '@video/lib/utils';
import { Account } from '@video/lib/database/client';
import { ChannelService } from '../channel/channel.service';
import { ListQuery } from '@video/lib/restful';

@Injectable()
export class VideoService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly channelService: ChannelService,
  ) {}

  public async updateVideo(account: Account, videoId: number, body: VideoUpdateDto) {
    await this.verifyAccountVideoPermission(account, videoId);

    return await this.database.video.update({
      where: { id: videoId },
      include: { channel: true },
      data: body,
    });
  }

  public async getRecommendedVideos(videoId: number, query: ListQuery) {
    const videos = await this.database.video.findMany({
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.database.video.count();
    const next = total > (query.page - 1) * query.count + videos.length;
    return { items: videos, total, next };
  }

  public async deleteVideo(account: Account, videoId: number) {
    await this.verifyAccountVideoPermission(account, videoId);

    await this.database.video.delete({ where: { id: videoId } });
  }

  public findById(videoId: number) {
    return this.database.video.findFirstOrThrow({
      where: { id: videoId },
      include: { channel: true, reactions: true },
    });
  }

  public createVideo(body: VideoCreateDto) {
    const now = DateUtils.now();
    return this.database.video.create({
      data: {
        title: body.title,
        channelId: body.channelId.clear,
        createdAt: now,
      },
    });
  }

  public async verifyAccountVideoPermission(account: Account, videoId: number) {
    const video = await this.database.video.findFirstOrThrow({ where: { id: videoId } });
    await this.channelService.verifyAccountChannelPermissions(account, video.channelId);
  }
}
