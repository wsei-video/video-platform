<script setup lang="ts">
import type { Video } from '@/services/api'
import type { VideoItemModes } from './VideoItem.vue'
import { useUiStore } from '@/store'

import { VideoItem } from '.'
import { computed } from 'vue'

const uiStore = useUiStore()

const props = defineProps<{
  videos: Video[]
  videoItemMode: VideoItemModes
}>()

const mode = computed<VideoItemModes>(() => (uiStore.isMobile.value ? 'tile' : props.videoItemMode))
</script>
<template>
  <div :class="['videos-grid', `videos-grid--${mode}`]">
    <VideoItem v-for="video in videos" :key="video.id" :mode="mode" :video-data="video" />
  </div>
</template>

<style scoped lang="scss">
.videos-grid {
  display: grid;
  gap: 1rem;

  &--list {
    grid-template-columns: 1fr;
  }

  &--tile {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
