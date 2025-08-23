<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useVideoPages, type VideoPageTypes } from './useVideoPages'
import type { Video } from '@/services/api'

import { AppIcon } from '@/components/ui'
import { VideosGrid } from '@/components/video'

const route = useRoute()

const videos = ref<Video[]>()
const props = computed(() => {
  const pages = useVideoPages()
  const name = route.name
  if (!name || !(name in pages)) {
    // move user to error page
    throw new Error('There is no such page')
  } else {
    return pages[name as VideoPageTypes]
  }
})

onMounted(async () => {
  const apiResponse = await props.value.fetchFunction()
  if (apiResponse) videos.value = apiResponse.data
})
</script>
<template>
  <div class="video-page">
    <h1 class="video-page__title">
      <AppIcon class="video-page__title__icon" :name="props.icon" />
      {{ props.title }}
    </h1>
    <section class="video-page__content">
      <VideosGrid
        v-if="videos"
        :videos="videos"
        :video-item-mode="props.videoItemMode"
        redirect-to="watch-page"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-page {
  padding: 1.25rem;
  display: grid;
  gap: 1.5rem;
}

.video-page__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 42px;
  font-weight: bold;
}

.video-page__title__icon {
  font-size: inherit;
  padding: 0.25rem;
  background-color: $primary;
  border-radius: 50%;
}
</style>
