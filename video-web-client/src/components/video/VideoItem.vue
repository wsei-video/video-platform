<script setup lang="ts">
import { computed } from 'vue'
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

import { VideoThumbnail } from './index'
import { ProfileBadge } from '@/components/ui'

import { VideoUtils } from '@/utils/video.utils'
import type { Video } from '@/services/api'

const { videoData, mode = 'auto' } = defineProps<{
  videoData: Video
  mode?: 'auto' | 'tile' | 'list'
}>()

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')
const getMode = computed(() => {
  if (mode === 'auto') {
    return isMobile.value ? 'tile' : 'list'
  }
  return mode
})
</script>
<template>
  <div :class="['video-item', `video-item__${getMode}`]">
    <VideoThumbnail
      class="video-item__thumbnail"
      :thumbnailSrc="videoData.thumbnail"
      :duration="videoData.duration"
    />
    <span class="video-item__title" v-tooltip:top="videoData.title">{{ videoData.title }}</span>
    <span class="video-item__additional-info"
      >{{ VideoUtils.formatCountCompact(videoData.views) }} views &nbsp;
      {{ VideoUtils.formatTimeSince(videoData.uploadedDate) }}</span
    >
    <span v-if="getMode === 'list'" class="video-item__description text-muted">{{
      videoData.description
    }}</span>
    <ProfileBadge
      class="video-item__profile-badge"
      :profile-image="videoData.creator.photoUrl"
      :profileName="videoData.creator.nickname"
    />
  </div>
</template>

<style lang="scss">
@import '../../styles/bootstrap/index.scss';

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

.video-item__list {
  grid-template-areas:
    'thumbnail title'
    'thumbnail additional-info'
    'thumbnail description'
    'thumbnail profile-badge';
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto 2fr;
}

.video-item__tile {
  grid-template-areas:
    'thumbnail thumbnail'
    'title title'
    'profile-badge additional-info';
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto;
  width: $video-item-thumbnail-width;

  .video-item__additional-info {
    justify-self: end;
    align-self: center;
  }

  .video-item__profile-badge {
    color: $text-muted;
    font-size: $font-size-small;

    .image-wrapper {
      width: 30px;
    }
  }
}

.video-item__thumbnail {
  grid-area: thumbnail;
}

.video-item__title {
  grid-area: title;
}

.video-item__profile-badge {
  grid-area: profile-badge;
  justify-self: start;
  align-self: start;
}

.video-item__description {
  font-size: $font-size-small;
  display: -webkit-box;
  grid-area: description;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.video-item__additional-info {
  grid-area: additional-info;
  color: $text-muted;
  font-size: $font-size-small;
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
</style>
