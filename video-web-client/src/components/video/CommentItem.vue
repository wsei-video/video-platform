<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useCommentReaction } from '@/application/useCommentReaction'
import { AppIcon, ProfileBadge } from '@/components/ui'
import { Comment } from '@/domain/comment'
import { useAuthStore } from '@/store'
import { useWatchPageContext } from '@/views/VideoPages/WatchPage'

import FeedbackComponent from '../feedback/FeedbackComponent.vue'
import { DropdownContent, DropdownItem, DropdownMenu, DropdownTrigger } from '../ui/dropdown'
import AddComment from './AddComment.vue'

const MAX_CHARS = 25

const { commentData, actions } = defineProps<{
  commentData: Comment
  actions?: boolean
}>()

const emit = defineEmits<{
  delete: [commentId: string]
  edit: [commentId: string, newContent: string]
  reply: [commentId: string, content: string]
  'comment-reaction': [commentId: string, reaction: string]
}>()

const authStore = useAuthStore()
const { video } = useWatchPageContext()
const { error, userReaction, handleReaction } = useCommentReaction(
  video.value?.id || '',
  commentData.id,
)

const hidden = ref(false)
const isEditing = ref(false)
const isReplying = ref(false)
const currentUserAvatar = ref('https://picsum.photos/200')

function handleHide() {
  if (commentData.content.length < MAX_CHARS) {
    hidden.value = false
    return
  }
  hidden.value = !hidden.value
}

function onEditSubmit(newContent: string) {
  emit('edit', commentData.id, newContent)
  isEditing.value = false
}

function onReplySubmit(content: string) {
  emit('reply', commentData.id, content)
  isReplying.value = false
}

onMounted(() => {
  if (commentData.content.length > MAX_CHARS) hidden.value = true
})
</script>
<template>
  <div class="video-comment">
    <div class="video-comment__header">
      <profile-badge
        profile-image="https://picsum.photos/200"
        :profile-name="commentData.user.name"
        class="video-comment__header__profile-badge"
      />
      <p class="video-comment__header__post-date">
        {{ commentData.timeSinceAdded }}
      </p>
    </div>
    <div class="video-comment__content">
      <template v-if="!isEditing">
        <p @click="handleHide" class="w-100">
          {{
            hidden ? commentData.content.substring(0, MAX_CHARS + 1) + '... ' : commentData.content
          }}
          <span v-if="hidden" class="video-comment__show-more">show more</span>
        </p>
        <DropdownMenu v-if="actions">
          <dropdown-trigger>
            <app-icon name="more_vert" />
          </dropdown-trigger>
          <dropdown-content>
            <dropdown-item @click="isEditing = true">
              <app-icon name="edit" />
              <p>Edit</p>
            </dropdown-item>
            <dropdown-item @click="emit('delete', commentData.id)">
              <app-icon name="delete" />
              <p>Delete</p>
            </dropdown-item>
          </dropdown-content>
        </DropdownMenu>
      </template>
      <AddComment
        v-else
        :initial-content="commentData.content"
        :show-avatar="false"
        :always-show-actions="true"
        :auto-focus="true"
        @submit="onEditSubmit"
        @cancel="isEditing = false"
      />
    </div>
    <div v-if="!isEditing" class="video-comment__actions">
      <FeedbackComponent
        @emoji-selected="(reaction: string) => handleReaction(commentData.id, reaction)"
        :selected-reaction="userReaction?.content"
        :reactions="commentData.reactions"
        mode="picker"
        class="fs-7"
      />
      <button
        v-if="authStore.isAuthenticated"
        class="btn-action"
        @click="isReplying = !isReplying"
      >
        Reply
      </button>
      <p v-if="error">{{ error.message }}</p>
    </div>
    <div v-if="isReplying" class="video-comment__reply">
      <AddComment
        :user-avatar="currentUserAvatar"
        placeholder="Add a reply..."
        :auto-focus="true"
        @submit="onReplySubmit"
        @cancel="isReplying = false"
      />
    </div>
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

.video-comment__content {
  display: flex;
}

.video-comment__show-more {
  color: $text-muted;
  font-size: $font-size-sm;
  cursor: pointer;
}

.video-comment__actions {
  display: flex;
  gap: 1rem;
}

.btn-action {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: $text-muted;
  cursor: pointer;

  &:hover {
    color: $primary;
  }
}

.video-comment__reply {
  margin-left: 3rem;
}
</style>
