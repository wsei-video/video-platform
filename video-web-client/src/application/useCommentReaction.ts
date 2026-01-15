import { type InfiniteData, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import type { Comment } from '@/domain/comment'
import type { CommentReaction } from '@/domain/reaction'
import type { PaginatedList } from '@/domain/shared/types'
import { useAuthStore } from '@/store'

import { useDeleteCommentReaction, useUpdateCommentReaction } from './commands/reaction'
import { useGetUserCommentReaction } from './queries/reaction'

export function useCommentReaction(videoId: string, commentId: string) {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()
  const userReactionQuery = useGetUserCommentReaction(videoId, commentId, {
    enabled: authStore.isAuthenticated,
  })

  const userReactionQueryKey = [
    'userVideoReaction',
    videoId,
    commentId,
    authStore.currentAuth?.account.id,
  ]
  const commentsQueryKey = ['comments', videoId]

  function updateReactionQueryCacheOnUpdate(newReaction: CommentReaction) {
    const oldReaction = queryClient.getQueryData<CommentReaction | null>(userReactionQueryKey)
    queryClient.setQueryData(userReactionQueryKey, newReaction)

    queryClient.setQueryData(
      commentsQueryKey,
      (oldComments: InfiniteData<PaginatedList<Comment>> | undefined) => {
        if (!oldComments) return

        return {
          ...oldComments,
          pages: oldComments.pages.map((page) => ({
            ...page,
            items: page.items.map((comment) => {
              if (comment.id !== commentId) return comment

              const newReactions = comment.reactions.map((r) => ({ ...r }))
              let newReactionFound = false

              for (const r of newReactions) {
                if (r.content === newReaction.content) {
                  r.count++
                  newReactionFound = true
                }
                if (oldReaction && r.content === oldReaction.content) {
                  r.count--
                }
              }

              if (!newReactionFound) {
                newReactions.push({ content: newReaction.content, count: 1 })
              }

              return {
                ...comment,
                userReaction: newReaction,
                reactions: newReactions.filter((r) => r.count > 0),
              }
            }),
          })),
        }
      },
    )
  }
  const userUpdateReactionMutation = useUpdateCommentReaction(videoId, {
    onSuccess: updateReactionQueryCacheOnUpdate,
  })

  function updateReactionQueryCacheOnDelete() {
    const currentReaction = queryClient.getQueryData<CommentReaction | null>(userReactionQueryKey)
    queryClient.setQueryData(userReactionQueryKey, null)

    queryClient.setQueryData(
      commentsQueryKey,
      (oldComments: InfiniteData<PaginatedList<Comment>> | undefined) => {
        if (!oldComments) return
        if (!currentReaction) return

        return {
          ...oldComments,
          pages: oldComments.pages.map((page) => ({
            ...page,
            items: page.items.map((comment) => {
              if (comment.id !== commentId) return comment

              const newReactions = comment.reactions.map((r) => ({ ...r }))

              for (const r of newReactions) {
                if (r.content === currentReaction.content) r.count--
              }

              return {
                ...comment,
                userReaction: null,
                reactions: newReactions.filter((r) => r.count > 0),
              }
            }),
          })),
        }
      },
    )
  }
  const userDeleteReactionMutation = useDeleteCommentReaction(videoId, {
    onSuccess: updateReactionQueryCacheOnDelete,
  })

  const isLoading = computed(
    () =>
      userReactionQuery.isLoading.value ||
      userUpdateReactionMutation.isPending.value ||
      userDeleteReactionMutation.isPending.value,
  )

  const error = computed(
    () =>
      userReactionQuery.error.value ||
      userUpdateReactionMutation.error.value ||
      userDeleteReactionMutation.error.value,
  )

  async function handleReaction(commentId: string, content: string) {
    const currentReaction = userReactionQuery.data.value
    if (currentReaction?.content === content) {
      await userDeleteReactionMutation.mutateAsync(commentId)
    } else {
      await userUpdateReactionMutation.mutateAsync({ content, commentId })
    }
  }

  return {
    isLoading,
    error,

    userReaction: userReactionQuery.data,
    handleReaction,
  }
}
