<script setup lang="ts">
import { computed, type CSSProperties, onMounted, ref, useTemplateRef } from 'vue'

import NoImagePlaceholder from '@/assets/no-image-placeholder.jpg'

import AnimatedPlaceholder from './AnimatedPlaceholder.vue'

export type AppImageProps = {
  src: string
  alt?: string
  width?: string
  height?: string
  borderRadius?: string
  fit?: CSSProperties['objectFit']
  aspectRatio?: CSSProperties['aspectRatio']
}

const {
  src,
  alt,
  width = '100%',
  height = '100%',
  borderRadius,
  aspectRatio,
  fit = 'cover',
} = defineProps<AppImageProps>()

const loaded = ref(false)
const imgRef = useTemplateRef('img-ref')

function onLoad() {
  loaded.value = true
}
function onError() {
  if (imgRef.value) {
    imgRef.value.src = NoImagePlaceholder
  }
}

const imageStyle = computed<CSSProperties>(() => ({
  width: width,
  height: height,
  borderRadius: borderRadius,
  aspectRatio,
  objectFit: fit,
}))

onMounted(() => {
  if (imgRef.value?.complete) {
    onLoad()
  }
})
</script>

<template>
  <div class="image-wrapper" :style="imageStyle">
    <AnimatedPlaceholder :width="width" :height="height" v-if="!loaded" />

    <img
      ref="img-ref"
      :src="src"
      :alt="alt"
      :class="{ 'image-loaded': loaded }"
      :style="imageStyle"
      class="image-main"
      loading="lazy"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.image-wrapper {
  overflow: hidden;
}

.image-main {
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.image-main.image-loaded {
  opacity: 1;
}
</style>
