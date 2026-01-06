<script setup lang="ts">
import { computed } from 'vue'

import { VideoPlayer } from '@/components/player'
import { AppIcon } from '@/components/ui'
import { VideosGrid } from '@/components/video'
import CommentItem from '@/components/video/CommentItem.vue'
import { flattenPagination } from '@/infrastructure/video-api/shared/utils'
import { useWatchPage } from '@/views/VideoPages/WatchPage'
import { CommentsSection, VideoInfo } from '@/views/VideoPages/WatchPage'

const {
  video,

  streams,
  streamsIsPending,

  recommendedVideos,
  isMobile,
  watchPageMode,
  isMobileCommentsSectionOpened,
  closeCommentsSection,
  openCommentsSection,
} = useWatchPage()

const adaptiveHlsUrl = computed(() => streams.value?.adaptive.find(stream => stream.format === 'hls')?.url)
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
        <VideoInfo class="watch-page__player__info" />
      </section>
      <section v-if="video && video.commentCount > 0" class="watch-page__comments">
        <h4 class="watch-page__comments__title">
          <AppIcon
            v-if="isMobileCommentsSectionOpened"
            @click="closeCommentsSection"
            name="close"
          />
          Comments:
        </h4>

        <CommentsSection
          v-if="!isMobile || isMobileCommentsSectionOpened"
          :mode="watchPageMode"
          :comments="[]"
          class="watch-page__comments__list"
        />

        <div v-else @click="openCommentsSection" class="watch-page__comments__trigger">
          <CommentItem :comment-data="video.comments[0]" class="watch-page__comments__preview" />
        </div>
      </section>
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
  display: grid;
  gap: 1rem;
  padding-bottom: 1rem;
  // width: fit-content;
  margin: 0 auto;

  &--mobile {
    .watch-page__player__info {
      padding: 0 1rem;
    }

    .watch-page__sidebar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5rem;
      padding: 0 1rem;
    }

    .watch-page__comments {
      margin: 0 1rem;
    }
  }

  &--desktop {
    padding: 1rem;
    grid-template-columns: 1fr clamp(200px, 30vw, 300px);
    grid-template-rows: auto 1fr;

    .watch-page__sidebar {
      grid-column: 2;
      grid-row: 1 / 3;
    }
  }
}

.watch-page__main {
  display: grid;
  gap: 1rem;
  max-width: calc((100vh - 190px) * v-bind(videoAspectRatio));
}

.watch-page__player {
  display: grid;
  gap: 1rem;
}

.watch-page__comments__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-size: $font-size-base * 1.25;
  font-weight: $font-weight-bold;
  margin-bottom: 1rem;
}

.watch-page__comments__trigger {
  cursor: pointer;
}

.watch-page__comments__preview {
  background-color: $accent;
  border-radius: $border-radius-sm;
  padding: 0.5rem;
}
</style>
