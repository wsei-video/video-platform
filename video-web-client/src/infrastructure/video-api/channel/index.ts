import { videoClient } from '../shared'
import { ChannelHttpRepository } from './channel.http-repository'

export const channelRepository = new ChannelHttpRepository(videoClient)
