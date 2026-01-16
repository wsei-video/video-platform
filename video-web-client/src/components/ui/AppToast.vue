<script setup lang="ts">
import { computed } from 'vue'

import { AppIcon } from '@/components/ui'

export type ToastVariant = 'success' | 'warning' | 'danger' | 'info'

const props = defineProps<{
  variant: ToastVariant
  title?: string
  message: string
}>()

defineEmits<{
  (e: 'close'): void
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-bg-success'
    case 'warning':
      return 'text-bg-warning'
    case 'danger':
      return 'text-bg-danger'
    default:
      return 'text-bg-primary'
  }
})

const iconName = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'check_circle'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'error'
    default:
      return 'info'
  }
})
</script>

<template>
  <div
    class="app-toast toast show align-items-center border-0"
    :class="variantClasses"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <AppIcon :name="iconName" class="fs-4" />
        <div class="d-flex flex-column">
          <strong v-if="title" class="mb-1">{{ title }}</strong>
          <span>{{ message }}</span>
        </div>
      </div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        aria-label="Close"
        @click="$emit('close')"
      ></button>
    </div>
  </div>
</template>

<style scoped></style>
