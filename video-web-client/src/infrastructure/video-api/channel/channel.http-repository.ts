import type { AxiosInstance } from 'axios'

import type { Account } from '@/domain/account'
import {
  Channel,
  type ChannelCreateCommand,
  type ChannelGetOptions,
  type ChannelLinkCommand,
  type ChannelRepository,
  type ChannelUpdateCommand,
} from '@/domain/channel'
import type { PaginatedList, PaginationOptions } from '@/domain/shared/types'
import type { Video } from '@/domain/video'

import { AccountMapper } from '../auth'
import type { AccountsDto, ChannelDto, ChannelsDto, VideosDto } from '../shared'
import { VideoMapper } from '../video/video.mapper'
import { ChannelMapper } from './channel.mapper'

export class ChannelHttpRepository implements ChannelRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly baseUrl: string = '/v1/channels',
  ) {}

  async getAvailableChannels({ page, count }: PaginationOptions): Promise<PaginatedList<Channel>> {
    const res = await this.httpClient.get<ChannelsDto>(`${this.baseUrl}`, {
      params: {
        page,
        count,
      },
    })
    return ChannelMapper.toPaginatedModel(res.data)
  }
  async createChannel(c: ChannelCreateCommand): Promise<Channel> {
    const dto = ChannelMapper.toCreateDto(c)
    const res = await this.httpClient.post<ChannelDto>(`${this.baseUrl}`, dto)
    return ChannelMapper.toModel(res.data)
  }
  async getChannel(options: ChannelGetOptions): Promise<Channel> {
    if ('channelId' in options) {
      const res = await this.httpClient.get<ChannelDto>(`${this.baseUrl}/${options.channelId}`)
      return ChannelMapper.toModel(res.data)
    } else {
      const res = await this.httpClient.get<ChannelDto>(`/v1/channel/slug/${options.slug}`)
      return ChannelMapper.toModel(res.data)
    }
  }
  async updateChannel(c: ChannelUpdateCommand): Promise<Channel> {
    const dto = ChannelMapper.toUpdateDto(c)
    const res = await this.httpClient.patch<ChannelDto>(`${this.baseUrl}/${c.id}`, dto)
    return ChannelMapper.toModel(res.data)
  }
  async deleteChannel(channelId: string): Promise<void> {
    await this.httpClient.delete(`${this.baseUrl}/${channelId}`)
  }
  async getChannelAccounts(
    channelId: string,
    { page, count }: PaginationOptions,
  ): Promise<PaginatedList<Account>> {
    const res = await this.httpClient.get<AccountsDto>(`${this.baseUrl}/${channelId}/accounts`, {
      params: {
        page,
        count,
      },
    })
    return AccountMapper.toPaginatedModel(res.data)
  }
  async linkChannelToAccount(c: ChannelLinkCommand): Promise<void> {
    await this.httpClient.post(`${this.baseUrl}/${c.id}/accounts`, { accountId: c.accountId })
  }
  async unLinkChannelToAccount(c: ChannelLinkCommand): Promise<void> {
    await this.httpClient.delete(`${this.baseUrl}/${c.id}/accounts/${c.accountId}`)
  }
  async getChannelVideos(
    channelId: string,
    { page, count }: PaginationOptions,
  ): Promise<PaginatedList<Video>> {
    const res = await this.httpClient.get<VideosDto>(`${this.baseUrl}/${channelId}/videos`, {
      params: {
        page,
        count,
      },
    })
    return VideoMapper.toPaginatedModel(res.data)
  }
}
