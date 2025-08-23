<script setup lang="ts">
import { computed, ref } from 'vue'

import { type VideoReaction } from '@/services/api'

import { AppIcon } from '@/components/ui'
import FeedbackEmoji from './FeedbackEmoji.vue'
import EmojiPicker from './EmojiPicker.vue'

const { reactions } = defineProps<{
  reactions: VideoReaction[]
}>()

const emit = defineEmits<{
  'emoji-selected': [emoji: string]
}>()

const isEmojiPickerOpened = ref(false)
const toggleEmojiPicker = () => (isEmojiPickerOpened.value = !isEmojiPickerOpened.value)
const closeEmojiPicker = () => (isEmojiPickerOpened.value = false)

const sortedReactions = computed(() => [...reactions].sort((x, y) => y.count - x.count))

const handleEmojiClick = (emoji: string) => {
  emit('emoji-selected', emoji)
  closeEmojiPicker()
}
</script>
<template>
  <div class="video-feedback">
    <FeedbackEmoji
      @click="handleEmojiClick(reaction.emoji)"
      v-for="reaction in sortedReactions"
      :key="reaction.emoji"
    >
      {{ reaction.emoji }} {{ reaction.count }}
    </FeedbackEmoji>
    <FeedbackEmoji>
      <AppIcon name="add_reaction" @click.stop="toggleEmojiPicker" />
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
  font-size: 1rem;
  display: inline-flex;
  align-items: center;

  background-color: $accent;
  padding: 0.25rem;
  border-radius: $border-radius;
}
</style>
