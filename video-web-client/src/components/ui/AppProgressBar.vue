<script setup lang="ts">
import { computed } from 'vue'

export type ProgressBarVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'

const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    variant?: ProgressBarVariant
    height?: string
    showLabel?: boolean
    striped?: boolean
    animated?: boolean
  }>(),
  {
    max: 100,
    variant: 'primary',
    height: '1rem',
    showLabel: false,
    striped: false,
    animated: false,
  },
)

const percentage = computed(() => {
  if (props.max === 0) return 0
  const pct = (props.value / props.max) * 100
  return Math.min(100, Math.max(0, pct))
})

const progressClasses = computed(() => {
  return [
    `bg-${props.variant}`,
    {
      'progress-bar-striped': props.striped || props.animated,
      'progress-bar-animated': props.animated,
    },
  ]
})

const labelText = computed(() => {
  return `${Math.round(percentage.value)}%`
})
</script>

<template>
  <div
    class="progress"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :style="{ height: height }"
  >
    <div class="progress-bar" :class="progressClasses" :style="{ width: `${percentage}%` }">
      <span v-if="showLabel">{{ labelText }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.progress {
  background-color: $body-bg-light; // Ensure good contrast on dark backgrounds if needed
  border-radius: $border-radius-sm;
}
</style>
