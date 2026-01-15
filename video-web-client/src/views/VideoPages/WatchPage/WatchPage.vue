<script setup lang="ts">
import { computed } from 'vue'

import { VideoPlayer } from '@/components/player'
import { VideosGrid } from '@/components/video'
import { flattenPagination } from '@/infrastructure/video-api/shared/utils'
import { useWatchPage } from '@/views/VideoPages/WatchPage'
import { CommentsSection, VideoInfo } from '@/views/VideoPages/WatchPage'

const {
  video,

  streams,
  streamsIsPending,

  recommendedVideos,
  watchPageMode,
  isMobileCommentsSectionOpened,
} = useWatchPage()

const adaptiveHlsUrl = computed(
  () => streams.value?.adaptive.find((stream) => stream.format === 'hls')?.url,
)
const videoAspectRatio = 16 / 9
</script>
<template>
  <div :class="['watch-page', `watch-page--${watchPageMode}`]">
    <main class="watch-page__main">
      <section class="watch-page__player">
        <VideoPlayer
          :source="adaptiveHlsUrl"
          :scrubber="streams?.scrubber"
          class="watch-page__player__video"
          :is-pending="streamsIsPending"
        />
        <VideoInfo v-if="video" :video="video" class="watch-page__player__info" />
      </section>
      <CommentsSection class="watch-page__comments__list" />
    </main>
    <aside
      v-if="!isMobileCommentsSectionOpened && recommendedVideos?.pages"
      class="watch-page__sidebar"
    >
      <VideosGrid
        video-item-mode="tile"
        :videos="flattenPagination(recommendedVideos)"
        redirect-to="watch-page"
      />
    </aside>
  </div>
</template>
<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.watch-page {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  margin: 0 auto;
  align-items: flex-start;
  width: 100%;

  &--mobile {
    flex-direction: column;

    .watch-page__player__info {
      padding: 0 1rem;
    }

    .watch-page__sidebar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5rem;
      padding: 0 1rem;
    }
  }

  &--desktop {
    padding: 1rem;

    .watch-page__sidebar {
      flex: 1;
    }
  }
}

.watch-page__main {
  display: grid;
  gap: 1rem;
  flex: 100;
  align-items: flex-start;
  width: 100%;

  @media (min-height: 480px) and (min-width: 640px) {
    max-width: calc((100vh - 190px) * v-bind(videoAspectRatio));
  }
}

.watch-page__player {
  display: grid;
  gap: 1rem;
}
</style>
