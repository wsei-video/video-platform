import { useQuery } from '@tanstack/vue-query'

import type { CommentReaction, VideoReaction } from '@/domain/reaction'
import { reactionRepository } from '@/infrastructure/video-api/reaction'
import type { appUseQueryOptions } from '@/infrastructure/video-api/shared/utils/type.utils'
import { useAuthStore } from '@/store'

export function useGetUserVideoReaction(
  videoId: string,
  options: appUseQueryOptions<VideoReaction>,
) {
  const authStore = useAuthStore()
  return useQuery<VideoReaction | null>({
    queryKey: ['userVideoReaction', videoId, authStore.currentAuth?.account.id],
    queryFn: () => reactionRepository.getUserVideoReaction(videoId),
    ...options,
  })
}

export function useGetUserCommentReaction(
  videoId: string,
  commentId: string,
  options: appUseQueryOptions<CommentReaction>,
) {
  const authStore = useAuthStore()
  return useQuery({
    queryKey: ['userVideoReaction', videoId, commentId, authStore.currentAuth?.account.id],
    queryFn: () => reactionRepository.getUserCommentReaction(videoId, commentId),
    ...options,
  })
}
