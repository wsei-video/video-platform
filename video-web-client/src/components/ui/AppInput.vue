<script setup lang="ts">
import { useAttrs } from 'vue'

export type InputVariant = 'light' | 'dark'
export type InputControlType = 'input' | 'textarea'
export type InputFeedback = InputErrorFeedback | InputHintFeedback

interface InputBaseFeedback {
  enabled: boolean
  message: string
}

export interface InputErrorFeedback extends InputBaseFeedback {
  type: 'error'
}

export interface InputHintFeedback extends InputBaseFeedback {
  type: 'hint'
}

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const model = defineModel()

const {
  label,
  variant = 'light',
  as: inputType = 'input',
  feedback = { enabled: false },
} = defineProps<{
  label?: string
  variant?: InputVariant
  feedback?: InputFeedback
  icon?: string
  as?: InputControlType
}>()
</script>
<template>
  <div>
    <label class="form-label" v-if="label" :for="attrs.id as string">{{ label }}</label>
    <input
      v-if="inputType == 'input'"
      :class="[
        'form-control',
        {
          'is-invalid': feedback.enabled && feedback.type === 'error',
          'bg-body': variant === 'dark',
        },
      ]"
      v-bind="attrs"
      v-model="model"
    />
    <textarea
      v-else-if="inputType == 'textarea'"
      :class="[
        'form-control',
        {
          'is-invalid': feedback.enabled && feedback.type === 'error',
          'bg-body': variant === 'dark',
        },
      ]"
      v-bind="attrs"
      v-model="model as string"
    ></textarea>
    <div
      v-if="feedback.enabled"
      :class="{
        'invalid-feedback': feedback.type === 'error',
        'form-text': feedback.type === 'hint',
      }"
    >
      {{ feedback.message }}
    </div>
  </div>
</template>

<style scoped></style>
