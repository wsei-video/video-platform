import { useMutation } from '@tanstack/vue-query'

import type { CommentReplyCreateCommand } from '@/domain/comment'
import { commentRepository } from '@/infrastructure/video-api/comment'

export function useReplyToComment() {
  return useMutation({
    mutationFn: (c: CommentReplyCreateCommand) => commentRepository.createReply(c),
    retry: false,
  })
}
