import { useQuery } from '@tanstack/vue-query'

import { videoRepository } from '@/infrastructure/video-api/video'

export function useGetVideo(videoId: string) {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => videoRepository.fetchVideo(videoId),
    enabled: !!videoId,
    refetchInterval: 5000,
  })
}
