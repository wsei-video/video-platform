<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'

import NoImagePlaceholder from '@/assets/no-image-placeholder.jpg'
import type { ImageDto } from '@/infrastructure/video-api/shared'

import AnimatedPlaceholder from './AnimatedPlaceholder.vue'

const { image, alt } = defineProps<{
  image: ImageDto | null
  alt?: string
}>()

const loaded = ref(false)
const imgRef = useTemplateRef('img-ref')

const variants = computed(() => [...(image?.variants || [])].sort((a, b) => a.width - b.width))

const srcSet = computed(() => variants.value.map((v) => `${v.url} ${v.width}w`).join(', '))

const fallbackSrc = computed(() => (variants.value.length ? variants.value[0].url : ''))

function onLoad() {
  loaded.value = true
}

function onError() {
  if (imgRef.value) {
    imgRef.value.src = NoImagePlaceholder
  }
}

onMounted(() => {
  if (imgRef.value?.complete) {
    onLoad()
  }
})
</script>

<template>
  <div class="image-wrapper">
    <AnimatedPlaceholder v-if="!loaded" />

    <img
      ref="img-ref"
      :src="fallbackSrc"
      :srcset="srcSet"
      :alt="alt"
      :class="{ 'image-loaded': loaded }"
      sizes="100vw"
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
  width: 100%;
  height: 100%;
}

.image-main {
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-main.image-loaded {
  opacity: 1;
}
</style>
