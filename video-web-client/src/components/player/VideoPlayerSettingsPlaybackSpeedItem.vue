<script setup lang="ts">
import { computed } from 'vue'

import { usePlaybackSpeedOptions } from './playback-speed'
import { useVideoPlayerStore } from '@/store'
import VideoPlayerMenuItem from './VideoPlayerMenuItem.vue'

const videoPlayerStore = useVideoPlayerStore()
const playbackSpeedOptions = usePlaybackSpeedOptions()

const playbackSpeedValue = computed(() => {
  const currentSpeedOption = playbackSpeedOptions.find(
    (option) => option.value === videoPlayerStore.playbackSpeed,
  )
  return currentSpeedOption?.label ? currentSpeedOption.label : videoPlayerStore.playbackSpeed
})
</script>

<template>
  <VideoPlayerMenuItem icon="slow_motion_video" label="Playback speed">
    {{ playbackSpeedValue }}
  </VideoPlayerMenuItem>
</template>
