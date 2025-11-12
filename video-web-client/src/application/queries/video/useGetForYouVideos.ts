import { useInfiniteQuery } from '@tanstack/vue-query'

import { videoRepository } from '@/infrastructure/video-api/video'

export function useGetForYouVideos() {
  return useInfiniteQuery({
    queryKey: ['trendingVideos'],
    queryFn: ({ pageParam }) => videoRepository.getForYouVideos({ page: pageParam, count: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) {
        return undefined
      }
      return allPages.length + 1
    },
  })
}
