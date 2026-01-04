import { useQuery } from '@tanstack/vue-query'

import type { VideoSource } from '@/domain/video'
import type { appUseQueryOptions } from '@/infrastructure/video-api/shared/utils/type.utils'
import { videoRepository } from '@/infrastructure/video-api/video'

export function useGetVideoSource(videoId: string, options: appUseQueryOptions<VideoSource> = {}) {
  return useQuery({
    queryKey: ['video-source', videoId],
    queryFn: () => videoRepository.fetchVideoSource(videoId),
    ...options,
  })
}
