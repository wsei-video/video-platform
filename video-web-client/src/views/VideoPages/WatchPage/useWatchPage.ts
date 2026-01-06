import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import type { InjectionKey } from 'vue'
import { computed, inject, provide, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useGetRecommendedVideos, useGetVideo } from '@/application/queries/video'
import { useGetMediaStreams } from '@/application/queries/video/useGetMediaStreams'

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
  const watchPageMode = computed(() => (isMobile.value ? 'mobile' : 'desktop'))

  const videoId = Array.isArray(route.params.videoId)
    ? route.params.videoId[0]
    : route.params.videoId
  const { data: video, isPending: videoIsPending, error: videoError } = useGetVideo(videoId)

  const { data: streams, isPending: streamsIsPending, error: streamsError } = useGetMediaStreams(videoId)

  const {
    data: recommendedVideos,
    isPending: recommendedIsPending,
    error: recommendedError,
    fetchNextPage,
    hasNextPage,
  } = useGetRecommendedVideos(videoId)

  const updateReaction = (emoji: string) => {
    console.log('emoji', emoji)
  }

  function openCommentsSection() {
    mobileCommentsSection.value = true
  }

  function closeCommentsSection() {
    mobileCommentsSection.value = false
  }

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

    watchPageMode,
    isMobile,
    isMobileCommentsSectionOpened,

    closeCommentsSection,
    openCommentsSection,

    updateReaction,
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
