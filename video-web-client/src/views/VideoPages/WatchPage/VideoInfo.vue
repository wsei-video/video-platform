<script setup lang="ts">
import { useVideoReaction } from '@/application/useVideoReaction'
import { FeedbackComponent } from '@/components/feedback'
import { AppButton, AppIcon, ProfileBadge } from '@/components/ui'
import type { Video } from '@/domain/video'

const { video } = defineProps<{
  video: Video
}>()

const { error, userReaction, handleReaction } = useVideoReaction(video.id)
</script>
<template>
  <div v-if="video" class="video-info">
    <div>
      <FeedbackComponent
        :reactions="video.reactions"
        :selectedReaction="userReaction?.content"
        mode="picker"
        to="video"
        @emoji-selected="handleReaction"
      />
      <p v-if="error">{{ error.message }}</p>
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
