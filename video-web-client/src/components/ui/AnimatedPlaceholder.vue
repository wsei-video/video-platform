<script setup lang="ts">
import type { CSSProperties } from 'vue'

const {
  height = '100%',
  width = '100%',
  borderRadius = '0',
  aspectRatio = '4/3',
} = defineProps<{
  height?: string
  width?: string
  borderRadius?: string
  aspectRatio?: CSSProperties['aspect-ratio']
}>()
</script>

<template>
  <div class="skeleton">&nbsp;</div>
</template>

<style lang="scss">
@keyframes background-animation {
  0% {
    background-position: 50% 0;
  }

  100% {
    background-position: -150% 0;
  }
}
.skeleton {
  height: v-bind(height);
  width: v-bind(width);
  border-radius: v-bind(borderRadius);
  aspect-ratio: v-bind(aspectRatio);
  background-image: linear-gradient(to right, #d6d7d8 0%, #e2e3e4 10%, #d6d7d8 20%, #d6d7d8 100%);
  background-size: 200% 100%;
  animation: background-animation 1.2s linear infinite;
}
</style>
