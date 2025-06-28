<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'

const playbackToggleDelay = 300
const videoPlayerStore = useVideoPlayerStore()

const togglePlaybackWhenFullscreenNotChanged = () => {
  const isFullscreen = videoPlayerStore.isFullscreen
  setTimeout(() => {
    if (isFullscreen === videoPlayerStore.isFullscreen) videoPlayerStore.togglePlaying()
  }, playbackToggleDelay)
}
</script>

<template>
  <div
    class="video-player-overlay-controls"
    @click="togglePlaybackWhenFullscreenNotChanged()"
    @dblclick="videoPlayerStore.toggleFullscreen()"
  ></div>
</template>

<style lang="scss" scoped>
.video-player-overlay-controls {
  position: absolute;
  inset: 0;
}
</style>
