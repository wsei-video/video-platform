import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

import type { QualityLevel } from '@/components/player/quality'
import { VideoUtils } from '@/infrastructure/video-api/shared/utils/video.utils'

export const useVideoPlayerStore = defineStore('video-player', () => {
  const source = ref<string | null>(null)
  const videoPlayerRef = shallowRef<HTMLElement | null>(null)
  const isPlaying = ref(false)
  const isBuffering = ref(false)
  const isMuted = ref(false)
  const isFullscreen = ref(false)
  const isPointerOverPlayer = ref(false)
  const isPointerMotionless = ref(false)
  const isSettingsMenuShown = ref(false)
  const volume = ref(1)
  const duration = ref(0)
  const bufferedDuration = ref(0)
  const currentTime = ref(0)
  const lastSeekTime = ref(0)
  const playbackSpeed = ref(1)
  const qualityLevels = shallowRef<QualityLevel[]>([])
  const currentQualityLevel = shallowRef<QualityLevel | null>(null)
  const preferredQualityLevel = shallowRef<QualityLevel | null>(null)

  const playbackProgress = computed(() =>
    duration.value === 0 ? 0 : currentTime.value / duration.value,
  )

  const bufferedProgress = computed(() =>
    duration.value === 0 ? 0 : bufferedDuration.value / duration.value,
  )

  const audibleVolume = computed(() => (isMuted.value ? 0 : volume.value))

  const isAudiblyMuted = computed(() => audibleVolume.value === 0)

  const formattedCurrentTime = computed(() => VideoUtils.formatDuration(currentTime.value))

  const formattedDuration = computed(() => VideoUtils.formatDuration(duration.value))

  const showControls = computed(
    () =>
      (isPointerOverPlayer.value && !isPointerMotionless.value) ||
      !isPlaying.value ||
      isSettingsMenuShown.value,
  )

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

  const setPointerOverPlayer = (value: boolean) => (isPointerOverPlayer.value = value)

  const setSettingsMenuShown = (updatedSettingsMenuShown: boolean) =>
    (isSettingsMenuShown.value = updatedSettingsMenuShown)

  const setPlaybackSpeed = (updatedPlaybackSpeed: number) =>
    (playbackSpeed.value = updatedPlaybackSpeed)

  let pointerMoveTimeout: number | undefined

  const hideControlsWhenPointerIsMotionlessAfter = 1500

  const handlePointerMove = () => {
    clearTimeout(pointerMoveTimeout)
    isPointerMotionless.value = false
    pointerMoveTimeout = setTimeout(
      () => (isPointerMotionless.value = true),
      hideControlsWhenPointerIsMotionlessAfter,
    )
  }

  const setQualityLevels = (updatedQualityLevels: QualityLevel[]) => {
    const sortedQualityLevels = updatedQualityLevels.filter(isLabeledQualityLevel)
    sortedQualityLevels.sort((level1, level2) => level2.height - level1.height)
    qualityLevels.value = sortedQualityLevels
  }

  const findQualityLevelByHlsIndex = (hlsIndex: number): QualityLevel | null => {
    return qualityLevels.value.find((level) => level.hlsIndex === hlsIndex) ?? null
  }

  const setCurrentQualityLevel = (updatedCurrentQualityLevel: QualityLevel | null) =>
    (currentQualityLevel.value = isLabeledQualityLevel(updatedCurrentQualityLevel)
      ? updatedCurrentQualityLevel
      : null)

  const setCurrentQualityLevelByHlsIndex = (hlsIndex: number) => {
    setCurrentQualityLevel(findQualityLevelByHlsIndex(hlsIndex))
  }

  const setPreferredQualityLevel = (updatedPreferredQualityLevel: QualityLevel | null) =>
    (preferredQualityLevel.value = isLabeledQualityLevel(updatedPreferredQualityLevel)
      ? updatedPreferredQualityLevel
      : null)

  const setPreferredQualityLevelByHlsIndex = (hlsIndex: number) => {
    setPreferredQualityLevel(findQualityLevelByHlsIndex(hlsIndex))
  }

  /**
   * Filter out unlabeled quality levels, this happens when the player is requested to play
   * the video directly from a Simple Media Playlist instead of the Multivariant Playlist
   */
  const isLabeledQualityLevel = (level: QualityLevel | null) => level?.name

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
    isPointerOverPlayer,
    isPointerMotionless,
    isSettingsMenuShown,
    setSettingsMenuShown,
    playbackSpeed,
    setPlaybackSpeed,
    showControls,
    setPointerOverPlayer,
    handlePointerMove,
    qualityLevels,
    setQualityLevels,
    currentQualityLevel,
    findQualityLevelByHlsIndex,
    setCurrentQualityLevel,
    setCurrentQualityLevelByHlsIndex,
    preferredQualityLevel,
    setPreferredQualityLevel,
    setPreferredQualityLevelByHlsIndex,
  }
})
