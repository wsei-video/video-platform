<script setup lang="ts">
import { computed } from 'vue'
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

import { VideoThumbnail } from './index'
import { ProfileBadge } from '@/components/ui'

import { VideoUtils } from '@/utils/video.utils'
import type { Video } from '@/services/api'

export type VideoItemModes = 'auto' | 'tile' | 'list'

const { videoData, mode = 'auto' } = defineProps<{
  videoData: Video
  mode?: VideoItemModes
}>()

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')
const computedMode = computed(() => {
  if (mode === 'auto') {
    return isMobile.value ? 'tile' : 'list'
  }
  return mode
})
</script>
<template>
  <RouterLink
    :to="`/${videoData.id}`"
    class="text-decoration-none text-white"
    :class="['video-item', `video-item__${computedMode}`]"
  >
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
    <span v-if="computedMode === 'list'" class="video-item__description text-muted">{{
      videoData.description
    }}</span>
    <ProfileBadge
      class="video-item__profile-badge"
      :profile-image="videoData.creator.photoUrl"
      :profileName="videoData.creator.nickname"
      :image-props="{ width: '30px' }"
    />
  </RouterLink>
</template>

<style scoped lang="scss">
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
  max-width: 1200px;
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
    font-size: $font-size-sm;
  }
}

.video-item__thumbnail {
  grid-area: thumbnail;
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
</style>
