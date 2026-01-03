import { useMutation } from '@tanstack/vue-query'

import type { ChannelLinkCommand } from '@/domain/channel'
import { channelRepository } from '@/infrastructure/video-api/channel'

export function useLinkChannelToAccount() {
  return useMutation({
    mutationFn: (c: ChannelLinkCommand) => channelRepository.linkChannelToAccount(c),
    retry: false,
  })
}
