<script setup lang="ts">
import { computed, ref } from 'vue'

import { AppIcon } from '@/components/ui'
import type { ReactionAggregate } from '@/domain/reaction'
import { useAuthStore } from '@/store'

import EmojiPicker from './EmojiPicker.vue'
import FeedbackEmoji from './FeedbackEmoji.vue'

const { reactions, mode, selectedReaction } = defineProps<{
  reactions: ReactionAggregate[]
  mode: 'picker' | 'info'
  selectedReaction?: string
}>()

const emit = defineEmits<{
  'emoji-selected': [emoji: string]
}>()

const authStore = useAuthStore()

const isEmojiPickerOpened = ref(false)
const toggleEmojiPicker = () => (isEmojiPickerOpened.value = !isEmojiPickerOpened.value)
const closeEmojiPicker = () => (isEmojiPickerOpened.value = false)

const sortedReactions = computed(() => [...reactions].sort((x, y) => y.count - x.count))

const isUserReaction = (emojiContent: string) => emojiContent === selectedReaction

const handleEmojiClick = (emoji: string) => {
  if (mode != 'picker' || !authStore.isAuthenticated) return
  emit('emoji-selected', emoji)
  closeEmojiPicker()
}
</script>
<template>
  <div class="video-feedback">
    <FeedbackEmoji
      @click="handleEmojiClick(reaction.content)"
      v-for="reaction in sortedReactions"
      :class="{ selected: isUserReaction(reaction.content) }"
      :key="reaction.content"
    >
      {{ reaction.content }} {{ reaction.count }}
    </FeedbackEmoji>
    <FeedbackEmoji
      v-if="mode === 'picker' && authStore.isAuthenticated"
      @click.stop="toggleEmojiPicker"
    >
      <AppIcon name="add_reaction" style="font-size: inherit" />
      <EmojiPicker
        v-showable="isEmojiPickerOpened"
        v-click-outside="closeEmojiPicker"
        @emoji-selected="handleEmojiClick"
      />
    </FeedbackEmoji>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-feedback {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.selected {
  border: 2px solid $primary;
}
</style>
