import { useMutation } from '@tanstack/vue-query'

import type { CommentReplyUpdateCommand } from '@/domain/comment'
import { commentRepository } from '@/infrastructure/video-api/comment'

export function updateReply() {
  return useMutation({
    mutationFn: (c: CommentReplyUpdateCommand) => commentRepository.updateReply(c),
    retry: false,
  })
}
