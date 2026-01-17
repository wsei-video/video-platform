import { useQuery } from '@tanstack/vue-query'

import type { MediaStreamsDto } from '@/infrastructure/video-api/shared'
import type { appUseQueryOptions } from '@/infrastructure/video-api/shared/utils/type.utils'
import { videoRepository } from '@/infrastructure/video-api/video'

export function useGetMediaStreams(
  videoId: string,
  options: appUseQueryOptions<MediaStreamsDto> = {},
) {
  return useQuery({
    queryKey: ['media-streams', videoId],
    queryFn: () => videoRepository.getMediaStreams(videoId),
    refetchInterval: 5000,
    ...options,
  })
}
