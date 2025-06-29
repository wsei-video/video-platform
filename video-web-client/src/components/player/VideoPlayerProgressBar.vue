<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const progress = defineModel<number>({ default: 0 })

const {
  secondaryProgress = 0,
  isRounded = false,
  progressColor = '#fff',
} = defineProps<{
  isRounded?: boolean
  secondaryProgress?: number
  progressColor?: string
}>()

const borderRadius = computed(() => (isRounded ? '4px' : '0'))

const progressBarRef = ref<HTMLElement | null>(null)

onBeforeUnmount(() => {
  stopDrag()
})

const startDrag = (event: MouseEvent | TouchEvent) => {
  event.preventDefault()
  updateProgressValueFromEvent(event)
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
}

const onDrag = (event: MouseEvent | TouchEvent) => {
  event.preventDefault()
  updateProgressValueFromEvent(event)
}

const stopDrag = (event?: Event) => {
  event?.preventDefault()
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

const updateProgressValueFromEvent = (event: MouseEvent | TouchEvent) => {
  const progressBarRect = progressBarRef.value?.getBoundingClientRect()
  if (!progressBarRect) return

  const progressX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const progressStart = progressBarRect.left
  const progressWidth = progressBarRect.width

  progress.value = Math.max(0, Math.min(1, (progressX - progressStart) / progressWidth))
}
</script>

<template>
  <div class="video-player-progress-bar">
    <div ref="progressBarRef" class="video-player-progress-bar-content">
      <div
        class="video-player-progress-bar-secondary-inner"
        :style="{ width: `${secondaryProgress * 100}%` }"
      ></div>
      <div class="video-player-progress-bar-inner" :style="{ width: `${progress * 100}%` }">
        <div class="video-player-progress-bar-inner-scrubber-indicator"></div>
      </div>
    </div>
    <div
      class="video-player-progress-bar-touch-target"
      @mousedown="startDrag"
      @touchstart="startDrag"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
$progress-bar-height: 4px;
$scrubber-indicator-size: $progress-bar-height * 3;
$progress-background-color: #ffffff30;

.video-player-progress-bar {
  position: relative;
  display: flex;

  &::before,
  &::after {
    content: '';
    display: block;
    width: $scrubber-indicator-size * 0.5;
    height: $progress-bar-height;
    position: relative;
    z-index: 1;
  }

  &::before {
    background-color: v-bind(progressColor);
    border-top-left-radius: v-bind(borderRadius);
    border-bottom-left-radius: v-bind(borderRadius);
  }

  &::after {
    background-color: $progress-background-color;
    border-top-right-radius: v-bind(borderRadius);
    border-bottom-right-radius: v-bind(borderRadius);
  }
}

.video-player-progress-bar-content {
  background-color: $progress-background-color;
  flex: 1;
}

.video-player-progress-bar-touch-target {
  position: absolute;
  left: 0;
  right: 0;
  height: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.video-player-progress-bar-inner {
  position: relative;
  background-color: v-bind(progressColor);
  height: $progress-bar-height;
}

.video-player-progress-bar-secondary-inner {
  position: absolute;
  left: 0;
  background-color: #fffb;
  height: $progress-bar-height;
}

.video-player-progress-bar-inner-scrubber-indicator {
  position: absolute;
  width: $scrubber-indicator-size;
  height: $scrubber-indicator-size;
  border-radius: 50%;
  background-color: v-bind(progressColor);
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
}
</style>
