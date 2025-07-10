<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'
import VideoPlayerControlButton from './VideoPlayerControlButton.vue'

const videoPlayerStore = useVideoPlayerStore()
</script>

<template>
  <VideoPlayerControlButton
    v-tooltip:top="videoPlayerStore.isPlaying ? 'Pause' : 'Play'"
    :icon="videoPlayerStore.isPlaying ? 'pause' : 'play_arrow'"
    @click="videoPlayerStore.togglePlaying()"
  />
</template>
