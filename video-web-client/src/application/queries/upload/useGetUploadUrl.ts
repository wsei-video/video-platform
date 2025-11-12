import { useMutation } from '@tanstack/vue-query'

import { videoRepository } from '@/infrastructure/video-api/video'

export function useGetUploadUrl() {
  return useMutation({
    mutationFn: (videoId: string) => videoRepository.getUploadUrl(videoId),
  })
}
