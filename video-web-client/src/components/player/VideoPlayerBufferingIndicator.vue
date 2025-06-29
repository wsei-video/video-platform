<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'
import VideoPlayerLoadingSpinner from './VideoPlayerLoadingSpinner.vue'

const videoPlayerStore = useVideoPlayerStore()
</script>

<template>
  <div class="video-player-buffering-indicator" :class="{ shown: videoPlayerStore.isBuffering }">
    <div class="video-player-buffering-indicator-overlay"></div>
    <div class="video-player-buffering-indicator-loader">
      <VideoPlayerLoadingSpinner />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-player-buffering-indicator {
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease-out;

  &.shown {
    opacity: 1;
  }
}

.video-player-buffering-indicator-overlay {
  position: absolute;
  inset: 0;
  background-color: #0008;
}

.video-player-buffering-indicator-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
