<script setup lang="ts">
import { VideoDuration } from '.'
import { AppImage } from '@/components/ui'

defineProps<{
  thumbnailSrc: string
  duration: number
}>()
</script>
<template>
  <div class="thumbnail-container">
    <AppImage :src="thumbnailSrc" class="thumbnail" />
    <VideoDuration :duration="duration" />
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.thumbnail-container {
  position: relative;
}

.thumbnail {
  aspect-ratio: $video-item-aspect-ratio;
  border-radius: $video-item-border-radius;
}
</style>
