<script setup lang="ts">
import { FeedbackComponent } from '@/components/feedback'
import { AppButton, AppIcon, ProfileBadge } from '@/components/ui'

import { useWatchPageContext } from '.'

const { video, updateReaction } = useWatchPageContext()
</script>
<template>
  <div v-if="video" class="video-info">
    <div class="video__reactions">
      <FeedbackComponent :reactions="[]" mode="picker" @emoji-selected="updateReaction" />
    </div>
    <h1 class="video-info__title">
      {{ video.title }}
    </h1>
    <div class="video-info__channel">
      <ProfileBadge :profile-image="''" :profile-name="video.channel.name" />
      <AppButton><AppIcon name="notification_add" />Subscribe</AppButton>
    </div>
    <p class="video-info__description">{{ video.description || 'No description provided :(' }}</p>
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
