import { useMutation } from '@tanstack/vue-query'

import type { VideoReaction } from '@/domain/reaction'
import { reactionRepository } from '@/infrastructure/video-api/reaction'
import type { appUseQueryOptions } from '@/infrastructure/video-api/shared/utils/type.utils'

export function useUpdateVideoReaction(
  videoId: string,
  options: appUseQueryOptions<VideoReaction>,
) {
  return useMutation({
    mutationFn: (content: string) => reactionRepository.createVideoReaction({ content, videoId }),
    retry: false,
    ...options,
  })
}

export function useUpdateCommentReaction(
  videoId: string,
  options: appUseQueryOptions<VideoReaction>,
) {
  return useMutation({
    mutationFn: ({ content, commentId }: { content: string; commentId: string }) =>
      reactionRepository.createCommentReaction({ content, videoId, commentId }),
    retry: false,
    ...options,
  })
}
