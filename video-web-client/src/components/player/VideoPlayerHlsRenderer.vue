<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import Hls from 'hls.js'

import { QualityLevel } from './quality'
import { useVideoPlayerStore } from '@/store'
import { VideoPlayerUtils } from './video-player.utils'

const videoPlayerStore = useVideoPlayerStore()

const videoRef = ref<HTMLVideoElement | null>(null)
const hlsInstance = shallowRef<Hls | null>(null)

const initializeVideoPlayer = () => {
  if (!videoRef.value) throw new Error('Video element ref not set')
  hlsInstance.value = new Hls()
  hlsInstance.value.on(Hls.Events.FRAG_BUFFERED, updateBufferedDuration)
  hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, updateQualityLevels)
  hlsInstance.value.on(Hls.Events.LEVEL_SWITCHED, updateCurrentQualityLevel)
  hlsInstance.value.attachMedia(videoRef.value)
}

const destroyVideoPlayer = () => {
  hlsInstance.value?.destroy()
  hlsInstance.value = null
}

const updateVideoSource = () =>
  videoPlayerStore.source
    ? hlsInstance.value?.loadSource(videoPlayerStore.source)
    : hlsInstance.value?.stopLoad()

const updateBufferedDuration = () => {
  if (videoRef.value)
    videoPlayerStore.setBufferedDuration(VideoPlayerUtils.calculateBufferedDuration(videoRef.value))
}

const updateQualityLevels = () => {
  if (hlsInstance.value)
    videoPlayerStore.setQualityLevels(QualityLevel.fromHlsLevels(hlsInstance.value.levels))
}

const updateCurrentQualityLevel = () => {
  if (hlsInstance.value)
    videoPlayerStore.setCurrentQualityLevelByHlsIndex(hlsInstance.value.currentLevel)
}

const handleVideoTimeUpdate = () => {
  videoPlayerStore.setCurrentTime(videoRef.value?.currentTime ?? 0)
  updateBufferedDuration()
}

const handleVideoDurationChange = () => {
  videoPlayerStore.setDuration(videoRef.value?.duration ?? 0)
}

const handleVideoLoadStart = () => {
  videoPlayerStore.setPlaying(false)

  // Playback rate is not persisted between video source changes
  if (videoRef.value) videoRef.value.playbackRate = videoPlayerStore.playbackSpeed
}

onMounted(() => {
  initializeVideoPlayer()
  updateVideoSource()
})

onBeforeUnmount(() => {
  destroyVideoPlayer()
})

watch(
  () => videoPlayerStore.source,
  () => updateVideoSource(),
)

watch(
  () => videoPlayerStore.isPlaying,
  async (isPlaying) => {
    if (isPlaying) {
      try {
        await videoRef.value?.play()
      } catch (error) {
        if (error instanceof DOMException) return
        throw error
      }
    } else videoRef.value?.pause()
  },
)

watch(
  () => videoPlayerStore.lastSeekTime,
  (lastSeekTime) => {
    if (videoRef.value) videoRef.value.currentTime = lastSeekTime
    updateBufferedDuration()
  },
)

watch(
  () => videoPlayerStore.audibleVolume,
  (audibleVolume) => {
    if (videoRef.value) videoRef.value.volume = audibleVolume
  },
)

watch(
  () => videoPlayerStore.preferredQualityLevel,
  (preferredQualityLevel) => {
    if (!hlsInstance.value) return
    const levelIndex = preferredQualityLevel?.hlsIndex ?? -1
    hlsInstance.value.currentLevel = levelIndex
    hlsInstance.value.nextLevel = levelIndex
  },
)

watch(
  () => videoPlayerStore.playbackSpeed,
  (playbackSpeed) => {
    if (videoRef.value) videoRef.value.playbackRate = playbackSpeed
  },
)
</script>

<template>
  <video
    ref="videoRef"
    class="video-player-hls-renderer"
    @loadstart="handleVideoLoadStart"
    @durationchange="handleVideoDurationChange"
    @timeupdate="handleVideoTimeUpdate"
    @waiting="videoPlayerStore.setBuffering(true)"
    @playing="videoPlayerStore.setBuffering(false)"
  ></video>
</template>

<style lang="scss" scoped>
.video-player-hls-renderer {
  width: 100%;
  background-color: black;
  display: block;
}
</style>

<style lang="scss">
#detach-button-host {
  // Hide Opera browser video tag buttons
  display: none;
}
</style>
