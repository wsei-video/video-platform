<script setup lang="ts">
import { computed } from 'vue'
import type { RouterLinkProps } from 'vue-router'
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

import { VideoThumbnail } from './index'
import { ProfileBadge } from '@/components/ui'
import { FeedbackComponent } from '@/components/feedback'

import { VideoUtils } from '@/utils/video.utils'
import type { Video } from '@/services/api'

export type VideoItemModes = 'auto' | 'tile' | 'list' | 'list-reactions'
export type RedirectTo = RouterLinkProps['to']

const MODES_WITH_PROFILE_BADGE: VideoItemModes[] = ['list', 'tile']
const MODES_WITH_DESCRIPTION: VideoItemModes[] = ['list']

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('sm')

const {
  videoData,
  mode = 'auto',
  redirectTo = `/`,
} = defineProps<{
  videoData: Video
  mode?: VideoItemModes
  redirectTo?: RedirectTo
}>()

const computedMode = computed(() => {
  if (mode === 'auto') {
    return isMobile.value ? 'tile' : 'list'
  }
  return mode
})
</script>
<template>
  <div class="video-item-container">
    <RouterLink
      :to="redirectTo"
      class="text-decoration-none text-white"
      :class="['video-item', `video-item__${computedMode}`]"
    >
      <VideoThumbnail
        class="video-item__thumbnail"
        :duration="videoData.duration"
        :image-props="{ src: videoData.thumbnail }"
      />
      <span class="video-item__title" v-tooltip:top="videoData.title">{{ videoData.title }}</span>
      <span class="video-item__additional-info"
        >{{ VideoUtils.formatCountCompact(videoData.views) }} views &nbsp;
        {{ VideoUtils.formatTimeSince(videoData.uploadedDate) }}</span
      >
      <span
        v-if="MODES_WITH_DESCRIPTION.includes(computedMode)"
        class="video-item__description text-muted"
        >{{ videoData.description }}</span
      >
      <ProfileBadge
        class="video-item__profile-badge"
        v-if="MODES_WITH_PROFILE_BADGE.includes(computedMode)"
        :profile-image="videoData.creator.photoUrl"
        :profileName="videoData.creator.nickname"
        :image-props="{ width: '30px' }"
      />
      <FeedbackComponent
        class="video-item__reactions"
        v-if="computedMode === 'list-reactions'"
        mode="info"
        :reactions="videoData.reactions"
      />
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-item-container {
  container: video-container / inline-size;
}

.video-item {
  display: grid;
  column-gap: 0.75rem;
  row-gap: 0.5rem;
  padding: 0.5rem;
  border-radius: $video-item-border-radius;
  transition: background-color 0.15s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background-color: $black;
  }
}

.video-item {
  grid-template-columns: minmax(0, 0.5fr) 1fr;
  max-width: 1200px;
  min-height: 120px;

  &__list {
    grid-template-areas:
      'thumbnail title'
      'thumbnail additional-info'
      'thumbnail description'
      'thumbnail profile-badge';
    grid-template-rows: auto auto auto 2fr;
  }

  &__list-reactions {
    grid-template-areas:
      'thumbnail title'
      'thumbnail additional-info'
      'thumbnail reactions';
    grid-template-rows: auto auto 1fr;
  }
}

.video-item__tile {
  grid-template-areas:
    'thumbnail thumbnail'
    'title title'
    'profile-badge additional-info';
  grid-template-columns: auto auto;
  grid-auto-rows: min-content;

  .video-item__additional-info {
    justify-self: end;
    align-self: center;
  }

  .video-item__profile-badge {
    color: $text-muted;
  }
}

.video-item__thumbnail {
  grid-area: thumbnail;
  aspect-ratio: 16 / 9;
  min-width: 0;
  width: 100%;
  object-fit: cover;
  align-self: start;
}

.video-item__title {
  grid-area: title;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.4em * 2);
}

.video-item__profile-badge {
  grid-area: profile-badge;
  justify-self: start;
  align-self: start;
}

.video-item__description {
  font-size: $font-size-sm;
  display: -webkit-box;
  grid-area: description;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.video-item__reactions {
  grid-area: reactions;
  justify-self: start;
  align-self: start;
}

.video-item__additional-info {
  grid-area: additional-info;
  color: $text-muted;
  font-size: $font-size-sm;
}

.video-item__additional-info__list {
  grid-template-areas:
    'additionals'
    'description'
    'profile-badge';
}

.video-item__additional-info__tile {
  grid-template-areas: 'profile-badge additionals';
}

@mixin video-item-compact-styles {
  .video-item {
    &__list,
    &__list-reactions {
      grid-template-columns: 1fr 1fr;

      .video-item__title {
        font-size: 0.75rem;
      }
      .video-item__description {
        font-size: 0.75rem;
      }

      .video-item__additional-info {
        font-size: 0.625rem;
      }

      .video-item__reactions {
        font-size: 0.625rem;
      }
      .video-item__profile-badge {
        font-size: 0.625rem;
      }
    }
  }
}

@include media-breakpoint-down(sm) {
  @include video-item-compact-styles();
}

@include media-container-down(650px, video-container) {
  @include video-item-compact-styles();
}
</style>
