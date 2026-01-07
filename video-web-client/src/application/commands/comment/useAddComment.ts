import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/vue-query'

import type { Comment, CommentCreateCommand } from '@/domain/comment'
import type { PaginatedList } from '@/domain/shared/types'
import { commentRepository } from '@/infrastructure/video-api/comment'

export function useAddComment(videoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (c: CommentCreateCommand) => commentRepository.createComment(c),
    retry: false,
    onSuccess: (newComment: Comment) => {
      // TODO: pretty usefull - can be generic to apply for all paginated responses
      queryClient.setQueryData(
        ['comments', videoId],
        (oldData: InfiniteData<PaginatedList<Comment>> | undefined) => {
          if (!oldData) return undefined
          const newPages = [...oldData.pages]

          if (newPages.length > 0) {
            newPages[0] = {
              ...newPages[0],
              items: [newComment, ...newPages[0].items],
              total: newPages[0].total + 1,
            }
          }

          return {
            ...oldData,
            pages: newPages,
          }
        },
      )
    },
  })
}
