<script setup lang="ts">
import { computed } from 'vue'

import { useQualityOptions } from './quality'
import { useVideoPlayerStore } from '@/store'
import VideoPlayerMenuItem from './VideoPlayerMenuItem.vue'

const videoPlayerStore = useVideoPlayerStore()
const qualityOptions = useQualityOptions()

const preferredQualityOption = computed(() =>
  qualityOptions.value.find((option) => option.level === videoPlayerStore.preferredQualityLevel),
)

const isAutoQuality = computed(() => !preferredQualityOption.value?.level)
</script>

<template>
  <VideoPlayerMenuItem icon="tune" label="Quality">
    <template v-if="preferredQualityOption">
      {{ preferredQualityOption.name }}
      <span
        v-if="isAutoQuality && videoPlayerStore.currentQualityLevel"
        class="auto-current-quality"
      >
        ({{ videoPlayerStore.currentQualityLevel.name }})
      </span>
    </template>
  </VideoPlayerMenuItem>
</template>

<style lang="scss" scoped>
.auto-current-quality {
  color: var(--bs-secondary-color);
  font-size: 0.85em;
}
</style>
