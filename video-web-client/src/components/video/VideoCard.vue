<script setup lang="ts">
import { AppImage, ProfileBadge } from '@/components/ui'
import { type VideoCard } from './index'
import { VideoDuration } from '@/components/video'
import { VideoUtils } from '@/utils/video.utils'

defineProps<{
  videoData: VideoCard
}>()
</script>

<template>
  <div class="video-card">
    <div class="thumbnail-container">
      <AppImage :src="videoData.thumbnail" class="thumbnail" />
      <VideoDuration :duration="videoData.duration" />
    </div>
    <div class="title fw-semibold">
      <span v-tooltip:top="videoData.title">{{ videoData.title }}</span>
    </div>
    <div class="additional-info">
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

.video-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  width: clamp(250px, 100%, 350px);
  padding: 0.5rem;
  border-radius: $video-card-border-radius;
  transition: background-color 0.15s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .thumbnail-container {
    position: relative;
  }

  .thumbnail {
    aspect-ratio: $video-card-aspect-ratio;
    border-radius: $video-card-border-radius;
  }

  .additional-info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 12px;
    font-weight: 400;
    color: $input-placeholder-color;

    span {
      font-weight: 400 !important;
    }

    .image-wrapper {
      width: 30px;
    }
  }
}
</style>
