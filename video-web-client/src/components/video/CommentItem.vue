<script setup lang="ts">
import type { VideoComment } from '@/services/api'
import { VideoUtils } from '@/utils/video.utils'

import { ProfileBadge } from '@/components/ui'
import { onMounted, ref } from 'vue'

const MAX_CHARS = 25

/*
TODO:
  - separate component: AddCommentItem
  - or another mode: add
*/
const { commentData } = defineProps<{ commentData: VideoComment }>()

const hidden = ref(false)

onMounted(() => {
  if (commentData.content.length > MAX_CHARS) hidden.value = true
})
</script>
<template>
  <div class="video-comment">
    <div class="video-comment__header">
      <profile-badge
        :profile-image="commentData.creator.photoUrl"
        :profile-name="commentData.creator.nickname"
        class="video-comment__header__profile-badge"
      />
      <p class="video-comment__header__post-date">
        {{ VideoUtils.formatTimeSince(commentData.postDate) }}
      </p>
    </div>
    <p @click="hidden = !hidden" class="video-comment__content">
      {{ hidden ? commentData.content.substring(0, MAX_CHARS + 1) + '... ' : commentData.content }}
      <span v-if="hidden" class="video-comment__show-more">show more</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-comment {
  display: grid;
  gap: 0.5rem;

  word-break: break-word;
}

.video-comment__header {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.video-comment__header__post-date {
  color: $text-muted;
  font-size: $font-size-sm;
}

.video-comment__show-more {
  color: $text-muted;
  font-size: $font-size-sm;
  cursor: pointer;
}
</style>
