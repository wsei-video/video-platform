import { computed, ref } from 'vue'

import type { VideoUpdateCommand } from '@/domain/video'
import { useVideoUploadStore } from '@/store/video-upload.store'

import { useUpdateVideo } from './commands/useUpdateVideo'
import { useGetVideo } from './queries/video'
import { useGetVideoSource } from './queries/video/useGetVideoSource'

export function useEditVideo(videoId: string) {
  const uploadStore = useVideoUploadStore()

  const videoQuery = useGetVideo(videoId)
  const sourceQuery = useGetVideoSource(videoId, {
    enabled: computed(() => !uploadStore.isUploadPending),
  })
  const updateQuery = useUpdateVideo()

  const saveError = ref<Error>()

  const error = computed(
    () =>
      videoQuery.error.value ||
      updateQuery.error.value ||
      saveError.value ||
      sourceQuery.error.value,
  )
  const isLoading = computed(
    () => videoQuery.isPending.value || updateQuery.isPending.value || sourceQuery.isPending.value,
  )

  async function saveVideo(c: VideoUpdateCommand) {
    saveError.value = undefined

    if (!videoQuery.data.value) return

    const updateError = videoQuery.data.value.validateUpdate(c)
    if (updateError) {
      saveError.value = updateError
      return
    }

    const video = await updateQuery.mutateAsync(c)
    return video
  }

  return {
    initialVideoData: videoQuery.data,
    videoSourceData: sourceQuery.data,
    updateResult: updateQuery.data,
    error,
    isLoading,
    saveVideo,
  }
}
