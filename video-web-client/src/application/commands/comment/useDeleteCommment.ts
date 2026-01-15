import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type { CommentDeleteCommand, CommentReplyDeleteCommand } from '@/domain/comment'
import { commentRepository } from '@/infrastructure/video-api/comment'

export function useDeleteComment(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId }: CommentDeleteCommand) =>
      commentRepository.deleteComment(videoId, commentId),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ exact: true, queryKey: ['comments', videoId] })
    },
  })
}

export function useDeleteReply(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, replyId }: CommentReplyDeleteCommand) =>
      commentRepository.deleteReply(videoId, commentId, replyId),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ exact: true, queryKey: ['comments', videoId] })
    },
  })
}
