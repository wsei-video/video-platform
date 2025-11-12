<script setup lang="ts">
import { useVideoRedirect, type VideoRedirect } from '@/composables'
import type { Video } from '@/domain/video'

import { VideoItem } from '.'
import type { VideoItemModes } from './VideoItem.vue'

defineProps<{
  videos: Video[]
  videoItemMode: VideoItemModes
  redirectTo: VideoRedirect
}>()
</script>
<template>
  <div :class="['videos-grid', `videos-grid--${videoItemMode}`]">
    <VideoItem
      v-for="video in videos"
      :key="video.id"
      :mode="videoItemMode"
      :video-data="video"
      :redirect-to="useVideoRedirect(redirectTo, video)"
    />
  </div>
</template>

<style scoped lang="scss">
.videos-grid {
  display: grid;
  gap: 1rem;

  &--list,
  &--list-reactions {
    display: flex;
    flex-direction: column;
  }

  &--tile {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
