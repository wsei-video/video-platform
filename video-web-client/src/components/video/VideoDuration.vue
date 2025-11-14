<script setup lang="ts">
import { VideoUtils } from '@/utils/video.utils'

defineProps<{
  duration: number
}>()
</script>
<template>
  <div class="video-duration">{{ VideoUtils.formatDuration(duration) }}</div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-duration {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;

  background-color: rgba($secondary, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: $border-radius;

  font-size: $font-size-sm;
  color: $white;
}

@include media-breakpoint-down(sm) {
  .video-duration {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
  }
}
</style>
