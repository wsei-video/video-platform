import { useInfiniteQuery } from '@tanstack/vue-query'

import { commentRepository } from '@/infrastructure/video-api/comment'

export function useGetVideoComments(videoId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', videoId],
    queryFn: ({ pageParam }) =>
      commentRepository.fetchComments(videoId, { page: pageParam, count: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) {
        return undefined
      }
      return allPages.length + 1
    },
  })
}
