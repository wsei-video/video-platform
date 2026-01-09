import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { DomainError, UnexpectedError } from '@/domain/shared/error'
import type { VideoUpdateCommand } from '@/domain/video'
import { useVideoUploadStore } from '@/store/video-upload.store'

import { useDeleteVideo, useUpdateVideo } from './commands/video'
import { useGetVideo } from './queries/video'
import { useGetMediaStreams } from './queries/video/useGetMediaStreams'
import { useGetVideoSource } from './queries/video/useGetVideoSource'

export function useEditVideo(videoId: string) {
  const uploadStore = useVideoUploadStore()
  const router = useRouter()

  const videoQuery = useGetVideo(videoId)
  const sourceQuery = useGetVideoSource(videoId, {
    enabled: computed(() => !uploadStore.isUploadPending),
  })
  const mediaStreams = useGetMediaStreams(videoId)

  const updateVideoQuery = useUpdateVideo()
  const deleteVideoQuery = useDeleteVideo()

  const saveError = ref<Error>()

  const error = computed(
    () =>
      videoQuery.error.value ||
      updateVideoQuery.error.value ||
      deleteVideoQuery.error.value ||
      saveError.value ||
      sourceQuery.error.value ||
      mediaStreams.error.value,
  )
  const isLoading = computed(
    () =>
      videoQuery.isPending.value ||
      updateVideoQuery.isPending.value ||
      sourceQuery.isPending.value ||
      deleteVideoQuery.isPending.value ||
      mediaStreams.isPending.value,
  )

  async function saveVideo(c: VideoUpdateCommand) {
    saveError.value = undefined

    if (!videoQuery.data.value) return

    try {
      videoQuery.data.value.validateUpdate(c)
      const video = await updateVideoQuery.mutateAsync(c)
      return video
    } catch (e: unknown) {
      if (e instanceof DomainError) {
        saveError.value = e
      } else {
        saveError.value = new UnexpectedError('Save video')
      }
    }
  }

  async function deleteVideo(videoId: string) {
    try {
      await deleteVideoQuery.mutateAsync(videoId)
      router.go(-1)
    } catch (e: unknown) {
      if (e instanceof DomainError) {
        saveError.value = e
      } else {
        saveError.value = new UnexpectedError('Save video')
      }
    }
  }

  return {
    initialVideoData: videoQuery.data,
    videoSourceData: sourceQuery.data,
    updateResult: updateVideoQuery.data,
    mediaStreamsData: mediaStreams.data,
    error,
    isLoading,
    saveVideo,
    deleteVideo,
    uploadVideo: uploadStore.handleUpload,

    pauseUpload: uploadStore.pause,
    resumeUpload: uploadStore.resume,
    abortUpload: uploadStore.abort,
  }
}
