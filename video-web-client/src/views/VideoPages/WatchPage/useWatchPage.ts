import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import type { InjectionKey } from 'vue'
import { computed, inject, provide, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useAddComment } from '@/application/commands/comment'
import { useDeleteComment } from '@/application/commands/comment/useDeleteCommment'
import { useGetVideoComments } from '@/application/queries/comment'
import { useGetRecommendedVideos, useGetVideo } from '@/application/queries/video'
import { useGetMediaStreams } from '@/application/queries/video/useGetMediaStreams'
import { flattenPagination } from '@/infrastructure/video-api/shared/utils'

type WatchPageContext = ReturnType<typeof useWatchPage>
const WatchPageKey: InjectionKey<WatchPageContext> = Symbol()

export function useWatchPage() {
  const route = useRoute()
  const breakpoints = useBreakpoints(breakpointsBootstrapV5)
  const isMobile = breakpoints.smaller('md')
  const mobileCommentsSection = ref(false)
  const isMobileCommentsSectionOpened = computed(
    () => isMobile.value && mobileCommentsSection.value,
  )
  function openCommentsSection() {
    mobileCommentsSection.value = true
  }

  function closeCommentsSection() {
    mobileCommentsSection.value = false
  }
  const watchPageMode = computed(() => (isMobile.value ? 'mobile' : 'desktop'))

  const videoId = Array.isArray(route.params.videoId)
    ? route.params.videoId[0]
    : route.params.videoId

  const { data: video, isPending: videoIsPending, error: videoError } = useGetVideo(videoId)

  const {
    data: streams,
    isPending: streamsIsPending,
    error: streamsError,
  } = useGetMediaStreams(videoId)

  const {
    data: recommendedVideos,
    isPending: recommendedIsPending,
    error: recommendedError,
    fetchNextPage,
    hasNextPage,
  } = useGetRecommendedVideos(videoId)

  const {
    data: commentsData,
    isPending: commentsIsPending,
    error: commentsError,
    fetchNextPage: getMoreComments,
    hasNextPage: hasMoreComments,
    refetch: refetchComments,
  } = useGetVideoComments(videoId)

  const addCommentMutation = useAddComment(videoId)
  const deleteCommentMutation = useDeleteComment(videoId)

  const context = {
    video,
    videoIsPending,
    videoError,

    streams,
    streamsIsPending,
    streamsError,

    recommendedVideos,
    recommendedIsPending,
    recommendedError,
    fetchNextPage,
    hasNextPage,

    commentsData: computed(() => flattenPagination(commentsData.value)),
    commentsIsPending,
    commentsError,
    getMoreComments,
    hasMoreComments,
    refetchComments,

    addCommentMutation,
    deleteCommentMutation,

    watchPageMode,
    isMobile,
    isMobileCommentsSectionOpened,

    closeCommentsSection,
    openCommentsSection,
  }

  provide(WatchPageKey, context)

  return context
}

export function useWatchPageContext() {
  const context = inject(WatchPageKey)
  if (!context) {
    throw new Error('WatchPageContext used outside of the scope')
  }
  return context
}
