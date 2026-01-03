import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useUploadVideoWithProgress } from '@/application/useUploadVideoWithProgress'
import type { UploadProgress, UploadStrategy } from '@/domain/upload'

export const useVideoUploadStore = defineStore('video-upload', () => {
  const progress = ref<UploadProgress>({ percentage: 0 })
  const strategy = ref<UploadStrategy>()

  function updateProgress(p: UploadProgress) {
    progress.value = p
    console.log(progress.value)
  }

  function setStrategy(s: UploadStrategy) {
    strategy.value = s
  }

  function pause() {
    strategy.value?.pause()
  }

  function resume() {
    strategy.value?.resume()
  }

  function abort() {
    strategy.value?.abort()
    progress.value = { percentage: 0 }
    resetUpload()
  }

  const { isSetupLoading, isUploadPending, uploadError, setupError, resetUpload, uploadVideo } =
    useUploadVideoWithProgress()

  async function handleUpload(file: File) {
    resetUpload()
    const { video, usedStrategy } = await uploadVideo(file, updateProgress)

    setStrategy(usedStrategy)
    return video
  }

  return {
    progress,
    setupError,
    uploadError,
    isSetupLoading,
    isUploadPending,
    pause,
    resume,
    abort,
    handleUpload,
  }
})
