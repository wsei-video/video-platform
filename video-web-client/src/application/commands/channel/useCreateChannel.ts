import { useMutation } from '@tanstack/vue-query'

import type { ChannelCreateCommand } from '@/domain/channel'
import { channelRepository } from '@/infrastructure/video-api/channel'

export function useCreateChannel() {
  return useMutation({
    mutationFn: (c: ChannelCreateCommand) => channelRepository.createChannel(c),
    retry: false,
  })
}
