<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useGetVideoPagesProps, type VideoPageTypes } from '@/application'
import { AppIcon } from '@/components/ui'
import { VideosGrid } from '@/components/video'
import { flattenPagination } from '@/infrastructure/video-api/shared/utils'

const route = useRoute()
const props = useGetVideoPagesProps({
  pageType: route.name as VideoPageTypes,
})
const { data: videosData, isPending: isVideosPending, error: videosError } = props.getVideosQuery()
</script>
<template>
  <div class="video-page">
    <h1 class="video-page__title">
      <AppIcon class="video-page__title__icon" :name="props.icon" />
      {{ props.title }}
    </h1>
    <section class="video-page__content">
      <div v-if="videosData?.pages">
        <VideosGrid
          :videos="flattenPagination(videosData)"
          :video-item-mode="props.videoItemMode"
          redirect-to="watch-page"
        />
      </div>
      <div v-if="isVideosPending">Pending</div>
      <div v-if="videosError">Error: {{ videosError.message }}</div>
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
