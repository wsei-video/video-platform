<script setup lang="ts">
import { computed, ref } from 'vue'

import { VideoUtils } from '@/infrastructure/video-api/shared/utils'
import { useVideoPlayerStore } from '@/store'

const { progress } = defineProps<{
  progress: number
}>()

const videoPlayerStore = useVideoPlayerStore()
const scrubber = videoPlayerStore.scrubberImage
const padding = 16

const wrapperRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const left = computed(() => {
  if (!wrapperRef.value || !containerRef.value) return 0

  const wrapperWidth = wrapperRef.value.clientWidth
  const containerWidth = containerRef.value.clientWidth
  const progressPositionInWrapper = progress * wrapperWidth - containerWidth / 2
  const minProgressPositionInWrapper = padding
  const maxProgressPositionInWrapper = wrapperWidth - containerWidth - padding

  const progressPosition = Math.min(
    maxProgressPositionInWrapper,
    Math.max(minProgressPositionInWrapper, progressPositionInWrapper),
  )

  return progressPosition
})

const hoveredTime = computed(() => progress * videoPlayerStore.duration)

const formattedHoveredTime = computed(() => VideoUtils.formatDuration(hoveredTime.value))

const frameIndex = computed(() => {
  if (!scrubber) return 0
  return Math.floor(hoveredTime.value / scrubber.frameDuration)
})

const frameLocation = computed(() => {
  if (!scrubber) return { atlas: 0, x: 0, y: 0 }
  const framesPerAtlas = scrubber.columns * scrubber.rows
  const atlas = Math.floor(frameIndex.value / framesPerAtlas)
  const frameIndexInAtlas = frameIndex.value % framesPerAtlas
  const x = frameIndexInAtlas % scrubber.columns * scrubber.width
  const y = Math.floor(frameIndexInAtlas / scrubber.columns) * scrubber.height
  return { atlas, x, y }
})
</script>

<template>
  <div ref="wrapperRef" class="video-player-scrubber-image-wrapper">
    <div
      ref="containerRef"
      class="video-player-scrubber-image"
      :style="{
        left: `${left}px`,
      }"
    >
      <div
        v-if="scrubber"
        class="video-player-scrubber-image-renderer"
        :style="{
          width: `${scrubber.width}px`,
          height: `${scrubber.height}px`,
          backgroundImage: `url(${scrubber.urls[frameLocation.atlas]})`,
          backgroundPositionX: `-${frameLocation.x}px`,
          backgroundPositionY: `-${frameLocation.y}px`,
        }"
      ></div>
      <div class="video-player-scrubber-image-time">{{ formattedHoveredTime }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-player-scrubber-image-wrapper {
  width: 100%;
  position: relative;
}

.video-player-scrubber-image {
  position: absolute;
  bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.video-player-scrubber-image-renderer {
  background-color: #000a;
  border-radius: 8px;
}

.video-player-scrubber-image-time {
  background-color: #000a;
  left: 0;
  font-size: 0.75em;
  padding: 0.35em 1em;
  border-radius: 1em;
  letter-spacing: 1px;
}
</style>
