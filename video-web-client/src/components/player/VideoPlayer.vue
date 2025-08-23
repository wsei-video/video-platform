<script setup lang="ts">
import { ref, watch } from 'vue'

import { useVideoPlayerStore } from '@/store'
import VideoPlayerBufferingIndicator from './VideoPlayerBufferingIndicator.vue'
import VideoPlayerControlBar from './VideoPlayerControlBar.vue'
import VideoPlayerHlsRenderer from './VideoPlayerHlsRenderer.vue'
import VideoPlayerOverlayControls from './VideoPlayerOverlayControls.vue'
import VideoPlayerSettingsMenu from './VideoPlayerSettingsMenu.vue'

const { source } = defineProps<{ source: string }>()

const videoPlayerStore = useVideoPlayerStore()
const videoPlayerRef = ref<HTMLElement | null>(null)

const updateFullscreen = () => {
  videoPlayerStore.setFullscreen(document.fullscreenElement === videoPlayerRef.value)
}

watch(
  () => source,
  (src) => videoPlayerStore.setSource(src),
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
    <template v-if="videoPlayerRef">
      <VideoPlayerHlsRenderer />
      <VideoPlayerBufferingIndicator />
      <VideoPlayerOverlayControls />
      <VideoPlayerControlBar />
      <VideoPlayerSettingsMenu />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.video-player {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  aspect-ratio: 16 / 9;
}
</style>
