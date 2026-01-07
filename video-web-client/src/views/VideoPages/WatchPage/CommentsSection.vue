<script setup lang="ts">
import { computed } from 'vue'

import { AppIcon } from '@/components/ui'
import { AddComment } from '@/components/video'
import CommentItem from '@/components/video/CommentItem.vue'
import type { Comment } from '@/domain/comment'
import { useAuthStore } from '@/store'

import { useWatchPageContext } from './useWatchPage'

const {
  video,

  isMobile,
  isMobileCommentsSectionOpened,
  closeCommentsSection,
  openCommentsSection,

  commentsData,
  commentsIsPending,
  commentsError,

  addCommentMutation,
  deleteCommentMutation,
} = useWatchPageContext()
const authStore = useAuthStore()

const error = computed(() => commentsError.value || addCommentMutation.error.value)

const openWholeSection = computed(() => !isMobile.value || isMobileCommentsSectionOpened.value)
const commentsCount = computed(() => commentsData.value.length)
const canPerformAction = (comment: Comment) => authStore.currentAuth?.account.id === comment.user.id

async function handleAddComment(content: string) {
  if (!video.value) return
  await addCommentMutation.mutateAsync({ content, videoId: video.value.id })
}

async function handleDeleteComment(commentId: string) {
  if (!video.value) return
  await deleteCommentMutation.mutateAsync({ videoId: video.value.id, commentId })
}
</script>
<template>
  <div>
    <section v-if="commentsCount > 0" class="comments" :class="{ mobile: isMobile }">
      <h4 class="watch-page__comments__title">
        <AppIcon v-if="isMobileCommentsSectionOpened" @click="closeCommentsSection" name="close" />
        Comments:
      </h4>
      <div v-if="openWholeSection" class="comments-section">
        <AddComment
          v-if="authStore.isAuthenticated"
          user-avatar="https://picsum.photos/200"
          @submit="handleAddComment"
        />
        <CommentItem
          v-for="comment in commentsData"
          :key="comment.id"
          :comment-data="comment"
          :actions="canPerformAction(comment)"
          @delete="handleDeleteComment"
        />
      </div>
      <div v-else class="watch-page__comments__trigger" @click="openCommentsSection">
        <CommentItem
          :comment-data="commentsData[0]"
          :actions="false"
          class="watch-page__comments__preview"
        />
      </div>
    </section>
    <section v-else class="comments" :class="{ mobile: isMobile }">
      <p class="mb-3">There are no comment's yet :(</p>
      <AddComment
        v-if="authStore.isAuthenticated"
        user-avatar="https://picsum.photos/200"
        @submit="handleAddComment"
      />
    </section>
    <p v-if="commentsIsPending">Loading ...</p>
    <p v-if="error">{{ error.message }}</p>
  </div>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';
.comments {
  &.mobile {
    margin: 0 1rem;
  }
}

.comments-section {
  display: grid;
  gap: 1.2rem;
}

.watch-page__comments__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-size: $font-size-base * 1.25;
  font-weight: $font-weight-bold;
  margin-bottom: 1rem;
}

.watch-page__comments__trigger {
  cursor: pointer;
}

.watch-page__comments__preview {
  background-color: $accent;
  border-radius: $border-radius-sm;
  padding: 0.5rem;
}
</style>
