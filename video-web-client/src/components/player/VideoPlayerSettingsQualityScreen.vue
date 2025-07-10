<script setup lang="ts">
import { useQualityOptions, type QualityOption } from './quality'
import { useVideoPlayerStore } from '@/store'
import VideoPlayerMenuItem from './VideoPlayerMenuItem.vue'

const videoPlayerStore = useVideoPlayerStore()
const qualityOptions = useQualityOptions()

const setPreferredQualityLevelAndCloseMenu = (option: QualityOption) => {
  videoPlayerStore.setPreferredQualityLevel(option.level)
  videoPlayerStore.setSettingsMenuShown(false)
}
</script>

<template>
  <VideoPlayerMenuItem
    v-for="(option, index) of qualityOptions"
    :key="index"
    :selected="videoPlayerStore.preferredQualityLevel === option.level"
    :label="option.name"
    @click="setPreferredQualityLevelAndCloseMenu(option)"
  />
</template>
