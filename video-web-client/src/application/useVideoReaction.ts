import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import type { VideoReaction } from '@/domain/reaction'
import type { Video } from '@/domain/video'
import { useAuthStore } from '@/store'

import { useDeleteVideoReaction, useUpdateVideoReaction } from './commands/reaction'
import { useGetUserVideoReaction } from './queries/reaction'

export function useVideoReaction(videoId: string) {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()
  const userReactionQuery = useGetUserVideoReaction(videoId, { enabled: authStore.isAuthenticated })

  const userReactionQueryKey = ['userVideoReaction', videoId, authStore.currentAuth?.account.id]
  const videoQueryKey = ['video', videoId]

  function updateReactionQueryCacheOnUpdate(newReaction: VideoReaction) {
    const oldReaction = queryClient.getQueryData<VideoReaction | null>(userReactionQueryKey)
    queryClient.setQueryData(userReactionQueryKey, newReaction)

    queryClient.setQueryData(videoQueryKey, (oldVideo: Video | undefined) => {
      if (!oldVideo) return
      const newReactions = oldVideo.reactions.map((r) => ({ ...r }))
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
        ...oldVideo,
        reactions: newReactions.filter((r) => r.count > 0),
      }
    })
  }
  const userUpdateReactionMutation = useUpdateVideoReaction(videoId, {
    onSuccess: updateReactionQueryCacheOnUpdate,
  })

  function updateReactionQueryCacheOnDelete() {
    const currentReaction = queryClient.getQueryData<VideoReaction | null>(userReactionQueryKey)
    queryClient.setQueryData(userReactionQueryKey, null)
    queryClient.setQueryData(videoQueryKey, (oldVideo: Video | undefined) => {
      if (!oldVideo) return
      if (!currentReaction) return
      const newReactions = oldVideo.reactions.map((r) => ({ ...r }))

      for (const r of newReactions) {
        if (r.content === currentReaction.content) r.count--
      }

      return {
        ...oldVideo,
        reactions: newReactions.filter((r) => r.count > 0),
      }
    })
  }
  const userDeleteReactionMutation = useDeleteVideoReaction(
    { videoId },
    { onSuccess: updateReactionQueryCacheOnDelete },
  )

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

  async function handleReaction(content: string) {
    const currentReaction = userReactionQuery.data.value
    if (currentReaction?.content === content) {
      await userDeleteReactionMutation.mutateAsync()
    } else {
      await userUpdateReactionMutation.mutateAsync(content)
    }
  }

  return {
    isLoading,
    error,

    userReaction: userReactionQuery.data,
    handleReaction,
  }
}
