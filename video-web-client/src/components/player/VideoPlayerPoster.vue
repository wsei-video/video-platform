<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'

import AppIcon from '../ui/AppIcon.vue'
import AppResponsiveImage from '../ui/AppResponsiveImage.vue'

const videoPlayerStore = useVideoPlayerStore()

const play = () => {
  videoPlayerStore.setPlaying(true)
  videoPlayerStore.setPosterVisible(false)
}
</script>

<template>
  <div class="video-player-poster-wrapper">
    <button type="button" class="video-player-poster" @click="play">
      <div class="video-player-poster-image">
        <AppResponsiveImage :image="videoPlayerStore.thumbnail" />
      </div>
      <div class="video-player-poster-content">
        <AppIcon class="video-player-poster-play-control" name="play_circle" />
      </div>
    </button>
  </div>
</template>

<style lang="scss">
.video-player-poster-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 10;
}

.video-player-poster {
  position: relative;
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.video-player-poster-image {
  position: relative;
  inset: 0;
  width: 100%;
  height: 100%;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: #0008;
    width: 100%;
    height: 100%;
  }
}

.video-player-poster-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player-poster-play-control {
  font-size: clamp(3em, 8vw, 8em);
  color: #fff;
}
</style>
