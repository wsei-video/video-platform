<script setup lang="ts">
import { useWatchPageContext } from '.'

import { FeedbackComponent } from '@/components/feedback'
import { ProfileBadge, AppButton, AppIcon } from '@/components/ui'

const { selectedVideo, updateReaction } = useWatchPageContext()
</script>
<template>
  <div v-if="selectedVideo" class="video-info">
    <div class="video__reactions">
      <FeedbackComponent
        :reactions="selectedVideo.reactions"
        mode="picker"
        @emoji-selected="updateReaction"
      />
    </div>
    <h1 class="video-info__title">
      {{ selectedVideo.title }}
    </h1>
    <div class="video-info__channel">
      <ProfileBadge
        :profile-image="selectedVideo.creator.photoUrl"
        :profile-name="selectedVideo.creator.nickname"
      />
      <AppButton><AppIcon name="notification_add" />Subscribe</AppButton>
    </div>
    <p class="video-info__description">{{ selectedVideo.description }}</p>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../styles/bootstrap/index.scss';

.video-info {
  display: grid;
  gap: 1rem;
}

.video-info__title {
  font-size: $font-size-lg;
  font-weight: 600;
}

.video-info__channel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.video-info__description {
  background-color: $accent;
  font-size: $font-size-sm;
  color: $text-muted;
  border-radius: $border-radius-sm;
  padding: 0.5rem;
}
</style>
