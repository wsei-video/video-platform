<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'

const videoPlayerStore = useVideoPlayerStore()
</script>

<template>
  <div class="video-player-error-screen">
    <div class="video-player-error-message">{{ videoPlayerStore.error }}</div>
  </div>
</template>

<style lang="scss" scoped>
.video-player-error-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 16% 0;
  background-color: #181818;
}
</style>
