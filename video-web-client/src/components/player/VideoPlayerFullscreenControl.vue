<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'

import VideoPlayerControlButton from './VideoPlayerControlButton.vue'

const videoPlayerStore = useVideoPlayerStore()
</script>

<template>
  <VideoPlayerControlButton
    :icon="videoPlayerStore.isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
    @click="videoPlayerStore.toggleFullscreen()"
  />
</template>
