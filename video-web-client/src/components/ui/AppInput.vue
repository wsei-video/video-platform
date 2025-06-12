<script setup lang="ts">
import { useAttrs } from 'vue'

export type InputVariant = 'light' | 'dark'
export type InputFeedback = {
  enabled: boolean
  error?: string
  hint?: string
}

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const model = defineModel()

const {
  label,
  variant = 'light',
  feedback = { enabled: false },
} = defineProps<{
  label?: string
  variant?: InputVariant
  feedback?: InputFeedback
  icon?: string
}>()
</script>
<template>
  <label class="form-label" v-if="label" :for="attrs.id as string">{{ label }}</label>
  <input
    :class="[
      'form-control',
      {
        'is-invalid': feedback.enabled && !!feedback.error,
        'bg-body': variant === 'dark',
      },
    ]"
    v-bind="attrs"
    v-model="model"
  />
  <div class="invalid-feedback">
    {{ feedback.error }}
  </div>
  <div class="form-text">
    {{ feedback.hint }}
  </div>
</template>

<style scoped></style>
