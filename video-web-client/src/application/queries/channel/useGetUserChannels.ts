import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import type { Channel } from '@/domain/channel'
import { channelRepository } from '@/infrastructure/video-api/channel'
import type { appUseQueryOptions } from '@/infrastructure/video-api/shared/utils/type.utils'
import { useAuthStore } from '@/store/auth.store'

export function useGetUserChannels(options: appUseQueryOptions<Channel[]> = {}) {
  const authStore = useAuthStore()
  const channelsQuery = useInfiniteQuery({
    queryKey: ['userChannels', computed(() => authStore.currentAuth?.account.id)],
    queryFn: ({ pageParam }) => {
      return channelRepository.getAvailableChannels({ page: pageParam, count: 20 })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) return undefined
      return allPages.length + 1
    },
    enabled: computed(() => authStore.isAuthenticated),
    ...options,
  })

  return channelsQuery
}
