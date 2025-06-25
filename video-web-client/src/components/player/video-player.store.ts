import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { VideoPlayerUtils } from './video-player.utils'

export const useVideoPlayerStore = defineStore('video-player', () => {
  const source = ref<string | null>(null)
  const videoPlayerRef = ref<HTMLElement | null>(null)
  const isPlaying = ref(false)
  const isBuffering = ref(false)
  const isMuted = ref(false)
  const isFullscreen = ref(false)
  const volume = ref(1)
  const duration = ref(0)
  const bufferedDuration = ref(0)
  const currentTime = ref(0)
  const lastSeekTime = ref(0)

  const playbackProgress = computed(() =>
    duration.value === 0 ? 0 : currentTime.value / duration.value,
  )

  const bufferedProgress = computed(() =>
    duration.value === 0 ? 0 : bufferedDuration.value / duration.value,
  )

  const audibleVolume = computed(() => (isMuted.value ? 0 : volume.value))

  const isAudiblyMuted = computed(() => audibleVolume.value === 0)

  const formattedCurrentTime = computed(() => VideoPlayerUtils.formatTime(currentTime.value))

  const formattedDuration = computed(() => VideoPlayerUtils.formatTime(duration.value))

  const setSource = (updatedSource: string | null) => (source.value = updatedSource)

  const setVideoPlayerRef = (updatedVideoPlayerRef: HTMLElement | null) =>
    (videoPlayerRef.value = updatedVideoPlayerRef)

  const setPlaying = (updatedIsPlaying: boolean) => (isPlaying.value = updatedIsPlaying)

  const togglePlaying = () => setPlaying(!isPlaying.value)

  const setBuffering = (updatedIsBuffering: boolean) => (isBuffering.value = updatedIsBuffering)

  const setMuted = (updatedIsMuted: boolean) => {
    isMuted.value = updatedIsMuted
    if (!isMuted.value && volume.value === 0) setVolume(1)
  }

  const setVolume = (updatedVolume: number) => {
    volume.value = updatedVolume
    if (isMuted.value && volume.value > 0) setMuted(false)
  }

  const setFullscreen = (updatedFullscreen: boolean) => (isFullscreen.value = updatedFullscreen)

  const toggleFullscreen = () =>
    isFullscreen.value ? document.exitFullscreen() : videoPlayerRef.value?.requestFullscreen()

  const setDuration = (updatedDuration: number) => (duration.value = updatedDuration)

  const setBufferedDuration = (updatedBufferedDuration: number) =>
    (bufferedDuration.value = updatedBufferedDuration)

  const setCurrentTime = (updatedCurrentTime: number) => (currentTime.value = updatedCurrentTime)

  const setLastSeekTime = (updatedLastSeekTime: number) =>
    (lastSeekTime.value = updatedLastSeekTime)

  const setLastSeekProgress = (updatedLastSeekProgress: number) => {
    setLastSeekTime(updatedLastSeekProgress * duration.value)
    setPlaybackProgress(updatedLastSeekProgress)
  }

  const setPlaybackProgress = (progress: number) => setCurrentTime(progress * duration.value)

  return {
    source,
    setSource,
    videoPlayerRef,
    setVideoPlayerRef,
    isPlaying,
    setPlaying,
    togglePlaying,
    isBuffering,
    setBuffering,
    isMuted,
    setMuted,
    isFullscreen,
    setFullscreen,
    toggleFullscreen,
    volume,
    audibleVolume,
    isAudiblyMuted,
    setVolume,
    duration,
    formattedDuration,
    setDuration,
    bufferedDuration,
    bufferedProgress,
    setBufferedDuration,
    currentTime,
    formattedCurrentTime,
    setCurrentTime,
    lastSeekTime,
    setLastSeekTime,
    setLastSeekProgress,
    playbackProgress,
    setPlaybackProgress,
  }
})
