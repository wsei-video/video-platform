import { useMutation } from '@tanstack/vue-query'

import type { ChannelUpdateCommand } from '@/domain/channel'
import { channelRepository } from '@/infrastructure/video-api/channel'

export function useUpdateChannel() {
  return useMutation({
    mutationFn: (c: ChannelUpdateCommand) => channelRepository.updateChannel(c),
    retry: false,
  })
}
