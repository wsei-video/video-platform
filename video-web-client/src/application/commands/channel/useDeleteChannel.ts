import { useMutation } from '@tanstack/vue-query'

import { channelRepository } from '@/infrastructure/video-api/channel'

export function useDeleteChannel() {
  return useMutation({
    mutationFn: (channelId: string) => channelRepository.deleteChannel(channelId),
    retry: false,
  })
}
