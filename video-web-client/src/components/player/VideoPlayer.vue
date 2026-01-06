<script setup lang="ts">
import { ref, watch } from 'vue'

import type { VideoScrubberImageDto } from '@/infrastructure/video-api/shared'
import { useVideoPlayerStore } from '@/store'

import VideoPlayerBufferingIndicator from './VideoPlayerBufferingIndicator.vue'
import VideoPlayerControlBar from './VideoPlayerControlBar.vue'
import VideoPlayerError from './VideoPlayerError.vue'
import VideoPlayerHlsRenderer from './VideoPlayerHlsRenderer.vue'
import VideoPlayerOverlayControls from './VideoPlayerOverlayControls.vue'
import VideoPlayerSettingsMenu from './VideoPlayerSettingsMenu.vue'

const {
  source,
  scrubber,
  isPending = false,
} = defineProps<{ source?: string; scrubber?: VideoScrubberImageDto | null; isPending?: boolean }>()

const videoPlayerStore = useVideoPlayerStore()
const videoPlayerRef = ref<HTMLElement | null>(null)

const updateFullscreen = () => {
  videoPlayerStore.setFullscreen(document.fullscreenElement === videoPlayerRef.value)
}

watch(
  () => isPending,
  (isPending) => videoPlayerStore.setBuffering(isPending),
  { immediate: true },
)

videoPlayerStore.setScrubberImage(scrubber ?? null)

watch(
  () => scrubber,
  (scrubber) => {
    videoPlayerStore.setScrubberImage(scrubber ?? null)
  },
)

watch(
  () => ({ source, isPending }),
  ({ source, isPending }) => {
    if (source) {
      videoPlayerStore.setError(null)
      videoPlayerStore.setSource(source)
    } else {
      if (!isPending) videoPlayerStore.setError('No video content')
    }
  },
  { immediate: true },
)

watch(
  () => videoPlayerRef.value,
  (videoPlayerRef) => videoPlayerStore.setVideoPlayerRef(videoPlayerRef),
)
</script>

<template>
  <div
    ref="videoPlayerRef"
    class="video-player"
    @fullscreenchange="updateFullscreen"
    @pointerenter="videoPlayerStore.setPointerOverPlayer(true)"
    @pointerleave="videoPlayerStore.setPointerOverPlayer(false)"
    @pointermove="videoPlayerStore.handlePointerMove()"
  >
    <template v-if="videoPlayerStore.error">
      <VideoPlayerError />
    </template>
    <template v-else>
      <template v-if="videoPlayerRef">
        <VideoPlayerHlsRenderer />
        <VideoPlayerBufferingIndicator />
        <VideoPlayerOverlayControls />
        <VideoPlayerControlBar />
        <VideoPlayerSettingsMenu />
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '../../styles/bootstrap/index.scss';

.video-player {
  position: relative;
  overflow: hidden;
  display: flex;
}

@include media-breakpoint-up(md) {
  .video-player {
    border-radius: 8px;
  }
}
</style>
