<script setup lang="ts">
import { type VideoComment } from '@/services/api'

import { CommentItem } from '@/components/video'

const { comments } = defineProps<{
  comments: VideoComment[]
}>()
</script>
<template>
  <div class="comments-section">
    <comment-item v-for="comment in comments" :key="comment.id" :comment-data="comment" />
  </div>
</template>

<style scoped lang="scss">
.comments-section {
  display: grid;
  gap: 1.2rem;
}
</style>
