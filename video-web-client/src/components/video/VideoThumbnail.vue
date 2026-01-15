<script setup lang="ts">

import type { Video } from '@/domain/video';

import AppResponsiveImage from '../ui/AppResponsiveImage.vue';
import { VideoDuration } from '.'

const props = defineProps<{ video: Video }>()
</script>
<template>
  <div class="thumbnail-container">
    <AppResponsiveImage :image="props.video.thumbnail" :alt="props.video.title" class="thumbnail" />
    <VideoDuration :duration="props.video.duration" />
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
