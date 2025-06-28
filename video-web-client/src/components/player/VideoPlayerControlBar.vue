<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'
import VideoPlayerFullscreenControl from './VideoPlayerFullscreenControl.vue'
import VideoPlayerPlayControl from './VideoPlayerPlayControl.vue'
import VideoPlayerProgressBar from './VideoPlayerProgressBar.vue'
import VideoPlayerSettingsControl from './VideoPlayerSettingsControl.vue'
import VideoPlayerVolumeControl from './VideoPlayerVolumeControl.vue'

const videoPlayerStore = useVideoPlayerStore()
</script>

<template>
  <div class="video-player-control-bar-wrapper" :class="{ shown: videoPlayerStore.showControls }">
    <VideoPlayerProgressBar
      progressColor="#ce7f00"
      :modelValue="videoPlayerStore.playbackProgress"
      :secondaryProgress="videoPlayerStore.bufferedProgress"
      @update:modelValue="(progress) => videoPlayerStore.setLastSeekProgress(progress)"
    />

    <div class="video-player-control-bar">
      <div class="video-player-control-bar-container">
        <VideoPlayerPlayControl />
        <VideoPlayerVolumeControl />
        <div class="video-player-control-bar-time">
          {{ videoPlayerStore.formattedCurrentTime }} / {{ videoPlayerStore.formattedDuration }}
        </div>
      </div>

      <div class="video-player-control-bar-container">
        <VideoPlayerSettingsControl />
        <VideoPlayerFullscreenControl />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-player-control-bar-wrapper {
  width: 100%;
  position: absolute;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.15s ease-out;

  &:hover,
  &.shown {
    opacity: 1;
  }
}

.video-player-control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0000007f;
  font-weight: 500;
}

.video-player-control-bar-container {
  display: flex;
  align-items: center;
}

.video-player-control-bar-time {
  padding: 0 0.5rem;
  font-size: 12px;
  margin: 0.15rem;
  letter-spacing: 1px;
}
</style>
