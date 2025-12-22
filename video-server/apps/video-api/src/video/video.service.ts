import { Injectable } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { Config } from '@video/lib/config';
import { DatabaseService } from '@video/lib/database';
import { DateUtils } from '@video/lib/utils';
import { Id, ListQuery, NotFoundError } from '@video/lib/restful';
import { UploadToken } from '@video/lib/token';

import { ChannelService } from '../channel/channel.service';
import { VideoCommonService } from './video-common.service';
import {
  VideoCreateDto,
  VideoSourceDto,
  VideoSourceUpdateDto,
  VideoUpdateDto,
  VideoUploadSourceDto,
} from './video.dto';

@Injectable()
export class VideoService {
  public constructor(
    private readonly config: Config,
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

  public async findSource(account: Account, videoId: number): Promise<VideoSourceDto> {
    const video = await this.verifyAccountVideoPermission(account, videoId);
    if (!video.sourceName || !video.sourceSize || !video.sourceUserId || !video.sourceKey)
      throw new NotFoundError({ resource: 'VideoSource' });

    const user = await this.database.account.findFirst({ where: { id: video.sourceUserId } });

    return {
      name: video.sourceName,
      size: video.sourceSize,
      url: `${this.config.video.cdnUrl}/uploads/${video.sourceKey}`,
      user,
    };
  }

  public async createUploadUrl(account: Account, videoId: number): Promise<VideoUploadSourceDto> {
    await this.verifyAccountVideoPermission(account, videoId);

    const expiresAt = DateUtils.now();
    expiresAt.setTime(expiresAt.getTime() + UploadToken.DefaultTokenExpiresIn);

    const baseUrl = `${this.config.video.uploadUrl}/v1/upload/video`;
    const uploadToken = new UploadToken({
      accountId: Id.clear(account.id),
      expiresAt,
      videoId: Id.clear(videoId),
    }).encrypt();

    return {
      simpleUploadUrl: `${baseUrl}/simple/${uploadToken}`,
      resumableUploadUrl: `${baseUrl}/resumable/${uploadToken}`,
    };
  }

  public async updateSource(videoId: number, body: VideoSourceUpdateDto) {
    await this.database.video.update({
      where: { id: videoId },
      data: {
        sourceKey: body.key,
        sourceName: body.name,
        sourceSize: body.size,
        sourceUserId: body.userId.clear,
      },
    });
  }

  public async verifyAccountVideoPermission(account: Account, videoId: number) {
    const video = await this.database.video.findFirstOrThrow({ where: { id: videoId } });
    await this.channelService.verifyAccountChannelPermissions(account, video.channelId);
    return video;
  }
}
