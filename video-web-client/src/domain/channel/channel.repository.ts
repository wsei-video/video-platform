import type { Account } from '../account'
import type { PaginatedList, PaginationOptions } from '../shared/types'
import type { Video } from '../video'
import type {
  ChannelCreateCommand,
  ChannelLinkCommand,
  ChannelUpdateCommand,
} from './channel.commands'
import type { Channel } from './channel.model'

type ChannelById = { channelId: string }
type ChannelBySlug = { slug: string }
export type ChannelGetOptions = ChannelById | ChannelBySlug

export interface ChannelRepository {
  getAvailableChannels(options: PaginationOptions): Promise<PaginatedList<Channel>>
  createChannel(c: ChannelCreateCommand): Promise<Channel>
  getChannel(options: ChannelGetOptions): Promise<Channel>
  updateChannel(c: ChannelUpdateCommand): Promise<Channel>
  deleteChannel(channelId: string): Promise<void>
  getChannelAccounts(channelId: string, options: PaginationOptions): Promise<PaginatedList<Account>>
  linkChannelToAccount(c: ChannelLinkCommand): Promise<void>
  unLinkChannelToAccount(c: ChannelLinkCommand): Promise<void>
  getChannelVideos(channelId: string, options: PaginationOptions): Promise<PaginatedList<Video>>
}
