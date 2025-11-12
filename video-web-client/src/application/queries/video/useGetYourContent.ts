import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { channelRepository } from '@/infrastructure/video-api/channel'
import { useChannelStore } from '@/store'

export function useGetYourContent() {
  const channelStore = useChannelStore()

  return useInfiniteQuery({
    queryKey: ['yourContent', computed(() => channelStore.selectedChannelId)],
    queryFn: ({ pageParam }) => {
      return channelRepository.getChannelVideos(channelStore.selectedChannelId!, {
        page: pageParam as number,
        count: 20,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) return undefined
      return allPages.length + 1
    },
    enabled: computed(() => !!channelStore.selectedChannelId),
  })
}
