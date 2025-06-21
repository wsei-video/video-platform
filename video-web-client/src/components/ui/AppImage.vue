<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'

import AnimatedPlaceholder from './AnimatedPlaceholder.vue'

defineProps<{
  src: string
  alt?: string
}>()

const loaded = ref(false)
const imgRef = useTemplateRef('img-ref')

function onLoad() {
  loaded.value = true
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
      :src="src"
      :alt="alt"
      :class="{ 'image-loaded': loaded }"
      class="image-main"
      loading="lazy"
      @load="onLoad"
    />
  </div>
</template>

<style scoped>
.image-wrapper {
  overflow: hidden;
}

.image-main {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.image-main.image-loaded {
  opacity: 1;
}
</style>
