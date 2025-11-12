import { useInfiniteQuery } from '@tanstack/vue-query'

import { videoRepository } from '@/infrastructure/video-api/video'

export function useGetRecommendedVideos(videoId: string) {
  return useInfiniteQuery({
    queryKey: ['trendingVideos'],
    queryFn: ({ pageParam }) =>
      videoRepository.fetchRecommendedVideosForVideo(videoId, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) {
        return undefined
      }
      return allPages.length + 1
    },
  })
}
