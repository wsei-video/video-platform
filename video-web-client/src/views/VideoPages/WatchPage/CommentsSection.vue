<script setup lang="ts">
import { CommentItem } from '@/components/video'
import { Comment } from '@/domain/comment'

const { comments } = defineProps<{
  comments: VideoComment[]
}>()
</script>
<template>
  <div class="comments-section" v-if="comments">
    <comment-item v-for="comment in comments" :key="comment.id" :comment-data="comment" />
  </div>
  <div v-else>There are no comment's yet :(</div>
</template>

<style scoped lang="scss">
.comments-section {
  display: grid;
  gap: 1.2rem;
}
</style>
