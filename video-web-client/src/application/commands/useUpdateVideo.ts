import { useMutation } from '@tanstack/vue-query'

import type { VideoUpdateCommand } from '@/domain/video'
import { videoRepository } from '@/infrastructure/video-api/video'

export function useUpdateVideo() {
  return useMutation({
    mutationFn: (c: VideoUpdateCommand) => videoRepository.updateVideo(c),
    retry: false,
  })
}
