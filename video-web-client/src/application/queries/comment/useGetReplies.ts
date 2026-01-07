import { useInfiniteQuery } from '@tanstack/vue-query'

import { commentRepository } from '@/infrastructure/video-api/comment'

export function useGetReplies(videoId: string, commentId: string) {
  return useInfiniteQuery({
    queryKey: ['replies', videoId, commentId],
    queryFn: ({ pageParam }) =>
      commentRepository.fetchReplies(videoId, commentId, { page: pageParam, count: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) {
        return undefined
      }
      return allPages.length + 1
    },
  })
}
