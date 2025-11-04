import { useRoute } from 'vue-router'
import { computed, inject, provide, ref, watch } from 'vue'
import type { InjectionKey } from 'vue'

import { useUiStore } from '@/store'
import { VideoApi, type Video } from '@/services/api'

export { default as VideoInfo } from './VideoInfo.vue'
export { default as CommentsSection } from './CommentsSection.vue'
export { default as WatchPage } from './WatchPage.vue'

type WatchPageContext = ReturnType<typeof useWatchPage>
const WatchPageKey: InjectionKey<WatchPageContext> = Symbol()

export function useWatchPage() {
  const route = useRoute()
  const uiStore = useUiStore()
  const selectedVideo = ref<Video>()
  const recommendedVideos = ref<Video[]>()
  const mobileCommentsSection = ref(false)
  const isMobileCommentsSectionOpened = computed(
    () => uiStore.isMobile.value && mobileCommentsSection.value,
  )

  const updateReaction = (emoji: string) => {
    // TODO: replace by api call later
    if (!selectedVideo.value) {
      console.warn('Selected video is null')
      return
    }
    const indexOfEmoji = selectedVideo.value.reactions.findIndex((r) => r.emoji === emoji)
    if (indexOfEmoji >= 0) {
      selectedVideo.value.reactions[indexOfEmoji].count += 1
    } else {
      selectedVideo.value.reactions.push({
        emoji,
        count: 1,
      })
    }
  }

  function openCommentsSection() {
    mobileCommentsSection.value = true
  }

  function closeCommentsSection() {
    mobileCommentsSection.value = false
  }

  async function fetchWatchPageData() {
    const videoId = Array.isArray(route.params.videoId)
      ? route.params.videoId[0]
      : route.params.videoId

    const videoResponse = await VideoApi.fetchVideo(videoId)
    if (videoResponse && videoResponse.data) selectedVideo.value = videoResponse.data

    const recommendedVideosResponse = await VideoApi.getRecommendedVideosForCurrentVideo(videoId)
    if (recommendedVideosResponse && recommendedVideosResponse.data)
      recommendedVideos.value = recommendedVideosResponse.data
  }

  watch(
    () => route.params.videoId,
    () => fetchWatchPageData(),
    { immediate: true },
  )

  const context = {
    selectedVideo,
    recommendedVideos,
    isMobile: uiStore.isMobile,
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
