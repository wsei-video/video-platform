<script setup lang="ts">
import { usePlaybackSpeedOptions, type PlaybackSpeedOption } from './playback-speed'
import { useVideoPlayerStore } from '@/store'
import VideoPlayerMenuItem from './VideoPlayerMenuItem.vue'

const videoPlayerStore = useVideoPlayerStore()
const playbackSpeedOptions = usePlaybackSpeedOptions()

const setPlaybackSpeedAndCloseMenu = (option: PlaybackSpeedOption) => {
  videoPlayerStore.setPlaybackSpeed(option.value)
  videoPlayerStore.setSettingsMenuShown(false)
}
</script>

<template>
  <VideoPlayerMenuItem
    v-for="option of playbackSpeedOptions"
    :selected="videoPlayerStore.playbackSpeed === option.value"
    :label="option.label ?? option.value.toString()"
    @click="setPlaybackSpeedAndCloseMenu(option)"
  />
</template>
