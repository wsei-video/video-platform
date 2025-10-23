import { VideoApi, type Video } from '@/services/api'
import type { IconName } from '@/components/ui/AppIcon.vue'
import type { VideoItemModes } from '@/components/video/VideoItem.vue'
import type { AxiosResponse } from 'axios'

export type VideoPageTypes = keyof ReturnType<typeof useVideoPages>
export type VideoPageProps = {
  title: string
  icon: IconName
  videoItemMode: VideoItemModes
  fetchFunction: () => Promise<AxiosResponse<Video[]>>
}

export function useVideoPages() {
  // TODO: change to currently logged userId later
  const currentUserId = '123'

  const trending = {
    title: 'Trending',
    icon: 'mode_heat',
    videoItemMode: 'list' as const,
    fetchFunction: () => VideoApi.fetchTrendingVideos(),
  }

  const mostPopular = {
    title: 'Most Popular',
    icon: 'trending_up',
    videoItemMode: 'tile' as const,
    fetchFunction: () => VideoApi.fetchMostPopularVideos(),
  }

  const recentlyUploaded = {
    title: 'Recently Updated',
    icon: 'schedule',
    videoItemMode: 'tile' as const,
    fetchFunction: () => VideoApi.fetchMostPopularVideos(),
  }

  const forYou = {
    title: 'For You',
    icon: 'account_circle',
    videoItemMode: 'list' as const,
    fetchFunction: () => VideoApi.fetchForYouVideos(currentUserId),
  }

  return {
    trending,
    'most-popular': mostPopular,
    'recently-uploaded': recentlyUploaded,
    'for-you': forYou,
  }
}
