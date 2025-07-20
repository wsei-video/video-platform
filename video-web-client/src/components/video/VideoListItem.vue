<script setup lang="ts">
import { VideoThumbnail } from './index'
import { ProfileBadge } from '@/components/ui'

import type { Video } from '@/services/api'
import { VideoUtils } from '@/utils/video.utils'

defineProps<{
  videoData: Video
}>()
</script>
<template>
  <div class="video-item video-list-item">
    <VideoThumbnail
      :thumbnailSrc="videoData.thumbnail"
      :duration="videoData.duration"
      class="video-list-item--thumbnail"
    />
    <div class="">
      <span class="video-item--title mb-1" v-tooltip:top="videoData.title">{{
        videoData.title
      }}</span>
      <div class="video-item--additional-info video-list-item--additional-info">
        <span
          >{{ VideoUtils.formatCountCompact(videoData.views) }} views &nbsp;
          {{ VideoUtils.formatTimeSince(videoData.uploadedDate) }}</span
        >
        <span class="video-item--description">{{ videoData.description }}</span>
        <ProfileBadge
          class="video-list-item-profile-badge"
          :profile-image="videoData.creator.photoUrl"
          :profileName="videoData.creator.nickname"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-item.video-list-item {
  display: flex;
  gap: 1rem;

  max-width: max(90%, 800px);
}

.video-list-item--thumbnail {
  min-width: $video-item-thumbnail-width;
}

.video-list-item--additional-info {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.75rem;
}

.video-list-item-profile-badge {
  color: $white;
  font-weight: $font-weight-semibold;
  font-size: 1rem;

  .image-wrapper {
    width: 40px;
  }
}
</style>
