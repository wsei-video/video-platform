import { useMutation } from '@tanstack/vue-query'

import { videoRepository } from '@/infrastructure/video-api/video'

export function useDeleteVideo() {
  return useMutation({
    mutationFn: (videoId: string) => videoRepository.deleteVideo(videoId),
    retry: false,
  })
}
