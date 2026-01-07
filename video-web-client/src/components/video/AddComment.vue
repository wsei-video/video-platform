<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { AppButton, AppIcon, ProfileBadge } from '@/components/ui'

const props = withDefaults(
  defineProps<{
    userAvatar?: string
    initialContent?: string
    placeholder?: string
    showAvatar?: boolean
    alwaysShowActions?: boolean
    autoFocus?: boolean
  }>(),
  {
    userAvatar: '',
    initialContent: '',
    placeholder: 'Add a comment...',
    showAvatar: true,
    alwaysShowActions: false,
    autoFocus: false,
  },
)

const emit = defineEmits<{
  submit: [content: string]
  cancel: []
}>()

const content = ref(props.initialContent)
const showActionButtons = ref(props.alwaysShowActions)
const inputRef = ref<HTMLTextAreaElement | null>(null)

watch(
  () => props.initialContent,
  (newVal) => {
    content.value = newVal
  },
)

const onCancel = () => {
  if (!props.alwaysShowActions) {
    content.value = ''
    showActionButtons.value = false
  } else {
    content.value = props.initialContent
  }
  emit('cancel')
}

const onSubmit = () => {
  if (!content.value.trim()) return
  emit('submit', content.value)
  if (!props.alwaysShowActions) {
    content.value = ''
    showActionButtons.value = false
  }
}

const handleClickOutside = () => {
  if (!props.alwaysShowActions) {
    showActionButtons.value = false
  }
}

onMounted(() => {
  if (props.autoFocus && inputRef.value) {
    inputRef.value.focus()
    showActionButtons.value = true
  }
})
</script>

<template>
  <div class="add-comment-wrapper" v-click-outside="handleClickOutside">
    <ProfileBadge v-if="showAvatar" :profile-image="userAvatar" profile-name="" avatar-only />
    <div class="input-area" :class="{ 'has-content': content }">
      <textarea
        ref="inputRef"
        v-model="content"
        class="comment-input"
        :placeholder="placeholder"
        @focus="showActionButtons = true"
        rows="1"
      ></textarea>
      <div v-if="showActionButtons" class="comment-actions">
        <AppButton variant="secondary" class="btn-sm" @click="onCancel"
          ><AppIcon name="cancel"
        /></AppButton>
        <AppButton variant="primary" class="btn-sm" :disabled="!content.trim()" @click="onSubmit"
          ><AppIcon name="check"
        /></AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.add-comment-wrapper {
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.input-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.comment-input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid $border-color;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  font-family: inherit;
  resize: none;
  overflow-y: hidden;

  &:focus {
    outline: none;
    border-bottom: 2px solid $primary;
    overflow-y: auto;
  }

  &::placeholder {
    color: $text-muted;
  }
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
