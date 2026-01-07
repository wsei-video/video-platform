import { useMutation } from '@tanstack/vue-query'

import type { DeleteVideoReactionCommand } from '@/domain/reaction'
import { reactionRepository } from '@/infrastructure/video-api/reaction'
import type { appUseQueryOptions } from '@/infrastructure/video-api/shared/utils/type.utils'

export function useDeleteVideoReaction(
  c: DeleteVideoReactionCommand,
  options: appUseQueryOptions<void>,
) {
  return useMutation({
    mutationFn: () => reactionRepository.deleteVideoReaction(c),
    ...options,
  })
}

export function useDeleteCommentReaction(videoId: string, options: appUseQueryOptions<void>) {
  return useMutation({
    mutationFn: (commentId: string) =>
      reactionRepository.deleteCommentReaction({ videoId, commentId }),
    retry: false,
    ...options,
  })
}
