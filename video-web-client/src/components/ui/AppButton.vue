<script setup lang="ts">
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'

const {
  variant = 'primary',
  disabled = false,
  outline = false,
} = defineProps<{
  variant?: string
  disabled?: boolean
  outline?: boolean
}>()
</script>

<template>
  <button
    :class="[
      'btn',
      disabled ? 'disabled' : '',
      outline ? `btn-outline-${variant}` : `btn-${variant}`,
    ]"
    :disabled="disabled"
    class="d-inline-flex align-items-center gap-2"
  >
    <slot />
  </button>
</template>

<style scoped></style>
