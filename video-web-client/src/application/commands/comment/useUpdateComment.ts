import { useMutation } from '@tanstack/vue-query'

import type { CommentUpdateCommand } from '@/domain/comment'
import { commentRepository } from '@/infrastructure/video-api/comment'

export function updateComment() {
  return useMutation({
    mutationFn: (c: CommentUpdateCommand) => commentRepository.updateComment(c),
    retry: false,
  })
}
