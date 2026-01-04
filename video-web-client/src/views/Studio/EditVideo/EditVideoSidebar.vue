<script setup lang="ts">
import { VideoPlayer } from '@/components/player'
import { AppButton, AppIcon } from '@/components/ui'
import { useVideoRedirect } from '@/composables'
import type { Video, VideoSource, VideoUpdateCommand } from '@/domain/video'
import type { MediaStreamsDto } from '@/infrastructure/video-api/shared'

import EditVideoSidebarElement from './EditVideoSidebarElement.vue'

const { videoData, videoSource, mediaStreams } = defineProps<{
  videoData: Video
  videoSource: VideoSource
  mediaStreams: MediaStreamsDto
}>()
const tempVideo = defineModel<VideoUpdateCommand>({ required: true })
const adaptiveHlsUrl = mediaStreams.adaptive.find(stream => stream.format === 'hls')?.url
</script>

<template>
  <aside class="edit-video__sidebar">
    <!-- Video Preview Card -->
    <div class="edit-video__preview-card">
      <VideoPlayer class="edit-video__player" :source="adaptiveHlsUrl" :scrubber="mediaStreams.scrubber" />

      <div class="edit-video__preview-info">
        <!-- Video Link -->
        <div class="edit-video__info-row">
          <span class="edit-video__info-label">Video link</span>
          <div class="edit-video__info-value">
            <RouterLink
              :to="useVideoRedirect('watch-page', videoData)"
              class="edit-video__video-link"
              >{{ `https://localhost:5173/${videoData.id}` }}</RouterLink
            >
            <AppButton variant="secondary" class="edit-video__copy-btn">
              <AppIcon name="content_copy" />
            </AppButton>
          </div>
        </div>

        <!-- Filename -->
        <div class="edit-video__info-row">
          <span class="edit-video__info-label">Filename</span>
          <span class="edit-video__info-value">{{ videoSource.name }}</span>
          <span class="edit-video__info-label">Size</span>
          <span class="edit-video__info-value">{{ videoSource.size }}</span>
        </div>

        <!-- Video Quality -->
        <div class="edit-video__info-row">
          <span class="edit-video__info-label">Video quality</span>
          <div class="edit-video__quality-badges">
            <span class="edit-video__quality-badge">SD</span>
            <span class="edit-video__quality-badge">HD</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Visibility -->
    <EditVideoSidebarElement icon="visibility" class="edit-video__sidebar-item">
      <template #title>Visibility</template>
      <template #content>
        <select class="form-select edit-video__select" v-model="tempVideo.visibility">
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option>Unlisted</option>
        </select>
      </template>
    </EditVideoSidebarElement>

    <!-- Subtitles -->
    <EditVideoSidebarElement icon="subtitles" class="edit-video__sidebar-item">
      <template #title>Subtitles</template>
      <template #content>
        <AppIcon name="edit" class="edit-video__sidebar-item-action" />
      </template>
    </EditVideoSidebarElement>
  </aside>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.edit-video__select {
  background-color: $input-bg;
  border: none;
  color: inherit;
  max-width: 300px;
}

.edit-video__sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-video__preview-card {
  background-color: $secondary;
  border-radius: $border-radius-md;
  overflow: hidden;
}

.edit-video__player {
  width: 100%;
}

.edit-video__preview-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-video__info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.edit-video__info-label {
  font-size: 0.75rem;
  color: $inactive-link;
}

.edit-video__info-value {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-break: break-all;
}

.edit-video__video-link {
  &:hover {
    text-decoration: underline;
  }
}

.edit-video__copy-btn {
  padding: 0.25rem !important;
  flex-shrink: 0;
}

.edit-video__quality-badges {
  display: flex;
  gap: 0.25rem;
}

.edit-video__quality-badge {
  background-color: $accent;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: $font-weight-bold;
  border: 1px solid $inactive-link;
}

.edit-video__sidebar-item-action {
  color: $inactive-link;
}

.edit-video__restriction-text {
  font-size: 0.875rem;
  color: $inactive-link;
}
</style>
