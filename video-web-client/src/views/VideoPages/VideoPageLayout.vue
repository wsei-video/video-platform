<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useGetVideoPagesProps, type VideoPageTypes } from '@/application'
import { AppIcon, AppSpinner } from '@/components/ui'
import { VideosGrid } from '@/components/video'
import { flattenPagination } from '@/infrastructure/video-api/shared/utils'
import { useUiStore } from '@/store'

const route = useRoute()
const uiStore = useUiStore()

const props = useGetVideoPagesProps({
  pageType: route.name as VideoPageTypes,
})
const { data: videosData, isPending: isVideosPending, error: videosError } = props.getVideosQuery()

const title = computed(() => {
  const searchQuery = route.query.search
  if (searchQuery && route.name === 'search') return `${props.title} "${searchQuery}"`

  return props.title
})

watch(
  () => videosError.value,
  (error) => {
    if (!error) return
    uiStore.showToast({
      variant: 'danger',
      message: error.message,
    })
  },
)
</script>
<template>
  <div class="video-page h-100 start position-relative">
    <h1 class="video-page__title">
      <AppIcon class="video-page__title__icon" :name="props.icon" />
      {{ title }}
    </h1>
    <section class="video-page__content">
      <div v-if="videosData?.pages">
        <VideosGrid
          :videos="flattenPagination(videosData)"
          :video-item-mode="props.videoItemMode"
          redirect-to="watch-page"
        />
      </div>
    </section>
    <AppSpinner mode="overlay" v-if="isVideosPending" />
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-page {
  padding: 1.25rem;
  display: grid;
  gap: 1.5rem;
  grid-auto-rows: min-content;
}

.video-page__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 42px;
  font-weight: bold;
  align-self: start;
}

.video-page__title__icon {
  font-size: inherit;
  padding: 0.25rem;
  background-color: $primary;
  border-radius: 50%;
}

@include media-breakpoint-down(md) {
  .video-page__title {
    font-size: 1.75rem;
  }
}
</style>
