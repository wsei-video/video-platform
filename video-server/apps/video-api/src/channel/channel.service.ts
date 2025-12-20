import { Injectable } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { DatabaseService } from '@video/lib/database';
import { DateUtils } from '@video/lib/utils';
import { ForbiddenError, ListQuery } from '@video/lib/restful';

import { ChannelAccountCreateDto, ChannelCreateDto, ChannelUpdateDto } from './channel.dto';
import { VideoCommonService } from '../video/video-common.service';

@Injectable()
export class ChannelService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly videoCommonService: VideoCommonService,
  ) {}

  public async listAccountChannels(account: Account, query: ListQuery) {
    const connections = await this.database.accountChannelConnection.findMany({
      where: { accountId: account.id },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { accountId: 'asc' }],
      include: {
        channel: true,
      },
    });

    const channels = connections.map(connection => connection.channel);
    const total = await this.database.accountChannelConnection.count({ where: { accountId: account.id } });
    const next = total > (query.page - 1) * query.count + channels.length;
    return { items: channels, total, next };
  }

  public find(channelId: number) {
    return this.database.channel.findFirstOrThrow({ where: { id: channelId } });
  }

  public async findBySlug(channelSlug: string) {
    return this.database.channel.findFirstOrThrow({ where: { slug: channelSlug } });
  }

  public async listChannelAccounts(account: Account, channelId: number, query: ListQuery) {
    await this.verifyAccountChannelPermissions(account, channelId);

    const connections = await this.database.accountChannelConnection.findMany({
      where: { channelId },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { accountId: 'asc' }],
      include: {
        account: true,
      },
    });

    const accounts = connections.map(connection => connection.account);
    const total = await this.database.accountChannelConnection.count({ where: { channelId } });
    const next = total > (query.page - 1) * query.count + accounts.length;
    return { items: accounts, total, next };
  }

  public async listChannelVideos(account: Account | null, channelId: number, query: ListQuery) {
    const videos = await this.database.video.findMany({
      where: { channelId },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      include: {
        channel: true,
        _count: {
          select: {
            comments: true,
          },
        },
        reactions: account
          ? {
              where: { userId: account.id },
            }
          : undefined,
      },
    });

    const reactions = await this.videoCommonService.aggregateVideoReactions(videos.map(video => video.id));

    const total = await this.database.video.count({ where: { channelId } });
    const next = total > (query.page - 1) * query.count + videos.length;

    return {
      items: videos.map(video => ({
        ...video,
        commentCount: video._count.comments,
        reactions: reactions.get(video.id) ?? [],
        userReaction: video.reactions?.[0] ?? null,
      })),
      total,
      next,
    };
  }

  public createAccountChannel(account: Account, body: ChannelCreateDto) {
    const now = DateUtils.now();

    return this.database.channel.create({
      data: {
        name: body.name,
        slug: body.slug,
        createdAt: now,
        accountChannelConnections: {
          create: {
            accountId: account.id,
            createdAt: now,
          },
        },
      },
    });
  }

  public async updateAccountChannel(account: Account, channelId: number, body: ChannelUpdateDto) {
    await this.verifyAccountChannelPermissions(account, channelId);

    return await this.database.channel.update({
      where: { id: channelId },
      data: body,
    });
  }

  public async deleteAccountChannel(account: Account, channelId: number) {
    await this.verifyAccountChannelPermissions(account, channelId);
    await this.database.channel.delete({ where: { id: channelId } });
  }

  public async linkChannelAccount(account: Account, channelId: number, body: ChannelAccountCreateDto) {
    await this.verifyAccountChannelPermissions(account, channelId);
    await this.database.account.findFirstOrThrow({ where: { id: body.accountId.clear } });
    await this.database.accountChannelConnection.create({ data: { accountId: body.accountId.clear, channelId } });
  }

  public async unlinkChannelAccount(account: Account, channelId: number, accountId: number) {
    await this.verifyAccountChannelPermissions(account, channelId);
    await this.database.accountChannelConnection.delete({
      where: {
        accountId_channelId: {
          accountId,
          channelId,
        },
      },
    });
  }

  public async verifyAccountChannelPermissions(account: Account, channelId: number) {
    const connection = await this.database.accountChannelConnection.findFirst({
      where: { accountId: account.id, channelId },
    });

    if (!connection) throw new ForbiddenError();
  }
}
