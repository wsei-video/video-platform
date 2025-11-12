<script setup lang="ts">
import { computed } from 'vue'

import { useVideoPlayerStore } from '@/store'

import VideoPlayerControlButton from './VideoPlayerControlButton.vue'
import VideoPlayerProgressBar from './VideoPlayerProgressBar.vue'

const videoPlayerStore = useVideoPlayerStore()

const buttonIcon = computed(() => {
  if (videoPlayerStore.isAudiblyMuted) return 'volume_off'
  if (videoPlayerStore.audibleVolume < 0.5) return 'volume_down'
  return 'volume_up'
})
</script>

<template>
  <div class="video-player-volume-control">
    <VideoPlayerControlButton
      :icon="buttonIcon"
      @click="videoPlayerStore.setMuted(!videoPlayerStore.isAudiblyMuted)"
    />

    <div class="video-player-volume-progress-bar">
      <VideoPlayerProgressBar
        :modelValue="videoPlayerStore.audibleVolume"
        :isRounded="true"
        @update:modelValue="videoPlayerStore.setVolume"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-player-volume-control {
  display: flex;
  align-items: center;
}

.video-player-volume-progress-bar {
  width: 5rem;
  padding: 0 0.5rem;
}
</style>
