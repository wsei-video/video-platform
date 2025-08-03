<script setup lang="ts">
import { ProfileBadge } from '@/components/ui'
import { VideoUtils } from '@/utils/video.utils'
import { VideoThumbnail } from '@/components/video'
import type { Video } from '@/services/api/api.types'

defineProps<{
  videoData: Video
}>()
</script>

<template>
  <div class="video-item video-card">
    <VideoThumbnail :thumbnailSrc="videoData.thumbnail" :duration="videoData.duration" />
    <div class="video-item--title">
      <span v-tooltip:top="videoData.title">{{ videoData.title }}</span>
    </div>
    <div class="video-item--additional-info video-card--additional-info">
      <ProfileBadge
        :profileImage="videoData.creator.photoUrl"
        :profileName="videoData.creator.nickname"
      />
      <div class="video-params">
        <span>
          {{ VideoUtils.formatCountCompact(videoData.views) }} views &nbsp;
          {{ VideoUtils.formatTimeSince(videoData.uploadedDate) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-item.video-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  width: $video-item-thumbnail-width;
}

.video-card--additional-info {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .image-wrapper {
    width: 30px;
  }
}
</style>
