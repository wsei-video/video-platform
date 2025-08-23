<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

import { VideoApi, type Video } from '@/services/api'

import { AppButton, AppIcon } from '@/components/ui'
import { VideosGrid } from '@/components/video'
import VideosTable from './VideosTable.vue'

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('lg')
const userVideos = ref<Video[]>([])

onMounted(async () => {
  const apiResponse = await VideoApi.fetchTrendingVideos()
  if (apiResponse) userVideos.value = apiResponse.data
})
</script>
<template>
  <div class="your-content">
    <section class="your-content__header">
      <h1 class="your-content__header__title">Your Content</h1>
      <AppButton class="your-content__header__btn"><AppIcon name="add" />Upload video</AppButton>
    </section>
    <section v-if="isMobile" class="your-content__videos">
      <VideosGrid video-item-mode="list-reactions" :videos="userVideos" redirect-to="studio" />
    </section>
    <section v-else class="your-content__videos">
      <div class="your-content__videos__table">
        <VideosTable :videos="userVideos" redirect-to="studio" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.your-content {
  padding: 2rem 1rem;
}

.your-content__header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.your-content__header__title {
  font-size: 1.25rem;
  font-weight: bold;
}

.your-content__header__btn {
  font-size: 0.75rem;
}

.your-content__videos {
  margin-top: 1.75rem;
  display: grid;
  gap: 1rem;
}

.your-content__videos__table {
  background-color: $secondary;
  border-radius: $border-radius-md;
  padding: 1.5rem;
}

@include media-breakpoint-up(md) {
  .your-content__header__title {
    font-size: 1.75rem;
  }

  .your-content__header__btn {
    font-size: 1rem;
  }
}
</style>
