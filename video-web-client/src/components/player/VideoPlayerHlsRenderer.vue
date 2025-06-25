<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Hls from 'hls.js'

import { useVideoPlayerStore } from './video-player.store'
import { VideoPlayerUtils } from './video-player.utils'

const videoPlayerStore = useVideoPlayerStore()

const videoRef = ref<HTMLVideoElement | null>(null)
const hlsInstance = ref<Hls | null>(null)

const initializeVideoPlayer = () => {
  if (!videoRef.value) throw new Error('Video element ref not set')
  hlsInstance.value = new Hls()
  hlsInstance.value.attachMedia(videoRef.value)
  hlsInstance.value.on(Hls.Events.FRAG_BUFFERED, updateBufferedDuration)
}

const destroyVideoPlayer = () => hlsInstance.value?.destroy()

const updateVideoSource = () =>
  videoPlayerStore.source
    ? hlsInstance.value?.loadSource(videoPlayerStore.source)
    : hlsInstance.value?.stopLoad()

const updateBufferedDuration = () => {
  if (videoRef.value)
    videoPlayerStore.setBufferedDuration(VideoPlayerUtils.calculateBufferedDuration(videoRef.value))
}

const handleVideoLoadStart = () => videoPlayerStore.setPlaying(false)

const handleVideoDurationChange = () => videoPlayerStore.setDuration(videoRef.value?.duration ?? 0)

const handleVideoTimeUpdate = () => {
  videoPlayerStore.setCurrentTime(videoRef.value?.currentTime ?? 0)
  updateBufferedDuration()
}

const handleVideoWaiting = () => videoPlayerStore.setBuffering(true)

const handleVideoPlaying = () => videoPlayerStore.setBuffering(false)

onMounted(() => {
  initializeVideoPlayer()
  updateVideoSource()

  videoRef.value?.addEventListener('loadstart', handleVideoLoadStart)
  videoRef.value?.addEventListener('durationchange', handleVideoDurationChange)
  videoRef.value?.addEventListener('timeupdate', () => handleVideoTimeUpdate)
  videoRef.value?.addEventListener('waiting', handleVideoWaiting)
  videoRef.value?.addEventListener('playing', handleVideoPlaying)
})

onBeforeUnmount(() => {
  videoRef.value?.removeEventListener('loadstart', handleVideoLoadStart)
  videoRef.value?.removeEventListener('durationchange', handleVideoDurationChange)
  videoRef.value?.removeEventListener('timeupdate', () => handleVideoTimeUpdate)
  videoRef.value?.removeEventListener('waiting', handleVideoWaiting)
  videoRef.value?.removeEventListener('playing', handleVideoPlaying)

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
</script>

<template>
  <video ref="videoRef" class="video-player-hls-renderer"></video>
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
