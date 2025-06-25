<script setup lang="ts">
import { useVideoPlayerStore } from './video-player.store'
import VideoPlayerControlButton from './VideoPlayerControlButton.vue'

const videoPlayerStore = useVideoPlayerStore()
</script>

<template>
  <VideoPlayerControlButton
    :icon="videoPlayerStore.isPlaying ? 'pause' : 'play_arrow'"
    @click="videoPlayerStore.togglePlaying()"
  />
</template>
