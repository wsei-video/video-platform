<script setup lang="ts">
import { ProfileBadge } from '@/components/ui'
import { type VideoItem } from './index'
import { VideoUtils } from '@/utils/video.utils'
import { VideoThumbnail } from '@/components/video'

defineProps<{
  videoData: VideoItem
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
        :profile-image="videoData.creator.profileImage"
        :profileName="videoData.creator.profileName"
      />
      <div class="video-params">
        <span>
          {{ VideoUtils.formatCountCompact(videoData.views) }} views &nbsp;
          {{ VideoUtils.formatTimeSince(videoData.uploadDate) }}
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
