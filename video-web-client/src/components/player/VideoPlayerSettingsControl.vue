<script setup lang="ts">
import { useVideoPlayerStore } from '@/store'
import VideoPlayerControlButton from './VideoPlayerControlButton.vue'

const videoPlayerStore = useVideoPlayerStore()
</script>

<template>
  <VideoPlayerControlButton
    icon="settings"
    class="video-player-settings-control"
    :icon-rotation="videoPlayerStore.isSettingsMenuShown ? 30 : 0"
    @click.stop="videoPlayerStore.setSettingsMenuShown(!videoPlayerStore.isSettingsMenuShown)"
  />
</template>
