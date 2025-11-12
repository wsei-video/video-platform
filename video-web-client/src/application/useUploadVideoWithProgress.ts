import { computed } from 'vue'

import { useCreateVideo, useUploadFile } from '@/application/commands'
import { useGetUploadUrl } from '@/application/queries/upload'
import { handleError, NoChannelError, NotAuthenticatedError } from '@/domain/shared/error'
import type { UploadProgress } from '@/domain/upload'
import type { VideoCreateCommand } from '@/domain/video'
import { uploadFactory } from '@/infrastructure/upload'
import { TusUploadStrategy } from '@/infrastructure/upload/upload.tus-strategy'
import { useChannelStore } from '@/store'
import { useAuthStore } from '@/store/auth.store'

// put this into store
export function useUploadVideoWithProgress() {
  const authStore = useAuthStore()
  const channelStore = useChannelStore()
  const strategy = uploadFactory('resumable')

  const {
    mutateAsync: createVideoAsync,
    isPending: isCreating,
    error: videoCreateError,
  } = useCreateVideo()
  const {
    mutateAsync: getUploadUrlAsync,
    isPending: isGettingUploadUrl,
    error: uploadUrlError,
  } = useGetUploadUrl()
  const {
    mutateAsync: uploadFileAsync,
    reset: resetUpload,
    isPending: isUploadPending,
    error: uploadError,
  } = useUploadFile(strategy)

  const isSetupLoading = computed(() => isCreating.value || isGettingUploadUrl.value)
  const setupError = computed(() => videoCreateError.value || uploadUrlError.value)

  const uploadVideo = async (file: File, onProgress: (p: UploadProgress) => void) => {
    try {
      if (!channelStore.selectedChannelId) throw new NoChannelError()
      if (!authStore.isAuthenticated) throw new NotAuthenticatedError()

      const command: VideoCreateCommand = {
        channelId: channelStore.selectedChannelId,
        title: file.name,
      }

      const createdVideo = await handleError('Create video', () => createVideoAsync(command))
      const uploadUrls = await handleError('Get upload url', () =>
        getUploadUrlAsync(createdVideo.id),
      )
      const url =
        strategy instanceof TusUploadStrategy
          ? uploadUrls.resumableUploadUrl
          : uploadUrls.simpleUploadUrl

      uploadFileAsync({
        file,
        url,
        onProgress,
      })

      return {
        video: createdVideo,
        usedStrategy: strategy,
      }
    } catch (e) {
      if (e instanceof NotAuthenticatedError) {
        console.log('User not authenticated => redirect to login page')
      }
      throw e
    }
  }

  return {
    resetUpload,
    uploadVideo,
    isSetupLoading,
    isUploadPending,
    uploadError,
    setupError,
  }
}
