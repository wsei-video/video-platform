<script setup lang="ts">
import { VideoDuration } from '.'
import { AppImage, type AppImageProps } from '@/components/ui'

defineProps<{
  duration: number
  imageProps: AppImageProps
}>()
</script>
<template>
  <div class="thumbnail-container">
    <AppImage v-bind="imageProps" class="thumbnail" />
    <VideoDuration :duration="duration" />
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.thumbnail-container {
  position: relative;
  display: inline-block;
}

.thumbnail {
  border-radius: $video-item-border-radius;
}
</style>
