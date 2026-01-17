import { useInfiniteQuery } from '@tanstack/vue-query'

import { videoRepository } from '@/infrastructure/video-api/video'

export function useGetSearchVideos({ phrase }: { phrase: string }) {
  return useInfiniteQuery({
    queryKey: ['searchVideos'],
    queryFn: ({ pageParam }) => videoRepository.searchVideos(phrase, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNext ? allPages.length + 1 : undefined),
  })
}
