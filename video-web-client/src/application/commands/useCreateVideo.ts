import { useMutation } from '@tanstack/vue-query'

import type { VideoCreateCommand } from '@/domain/video'
import { videoRepository } from '@/infrastructure/video-api/video'

export function useCreateVideo() {
  return useMutation({
    mutationFn: (c: VideoCreateCommand) => videoRepository.createVideo(c),
    retry: false,
  })
}
