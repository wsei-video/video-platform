import type { InfiniteData, UseInfiniteQueryReturnType } from '@tanstack/vue-query'

import {
  useGetForYouVideos,
  useGetMostPopularVideos,
  useGetRecentlyUplaoded,
  useGetTrendingVideos,
} from '@/application/queries/video'
import type { IconName } from '@/components/ui/AppIcon.vue'
import type { VideoItemModes } from '@/components/video/VideoItem.vue'
import type { PaginatedList } from '@/domain/shared/types'
import type { Video } from '@/domain/video'

export type VideoPageTypes = 'trending' | 'most-popular' | 'for-you' | 'recently-uploaded'
export interface VideoPageProps {
  title: string
  icon: IconName
  videoItemMode: VideoItemModes
  getVideosQuery: () => UseInfiniteQueryReturnType<InfiniteData<PaginatedList<Video>>, Error>
}

interface getVideoPagesPropsInput {
  pageType: VideoPageTypes
}

interface getVideoPagesPropsDependencies {
  getTrending: () => ReturnType<typeof useGetTrendingVideos>
  getMostPopular: () => ReturnType<typeof useGetMostPopularVideos>
  getRecentlyUploaded: () => ReturnType<typeof useGetRecentlyUplaoded>
  getForYou: () => ReturnType<typeof useGetForYouVideos>
}

export function getVideoPagesProps(
  { pageType }: getVideoPagesPropsInput,
  { getTrending, getForYou, getMostPopular, getRecentlyUploaded }: getVideoPagesPropsDependencies,
): VideoPageProps {
  switch (pageType) {
    case 'trending':
      return {
        title: 'Trending',
        icon: 'mode_heat',
        videoItemMode: 'auto' as const,
        getVideosQuery: () => getTrending(),
      }
    case 'most-popular':
      return {
        title: 'Most Popular',
        icon: 'trending_up',
        videoItemMode: 'tile' as const,
        getVideosQuery: () => getMostPopular(),
      }
    case 'for-you':
      return {
        title: 'For You',
        icon: 'account_circle',
        videoItemMode: 'auto' as const,
        getVideosQuery: () => getForYou(),
      }
    case 'recently-uploaded':
      return {
        title: 'Recently Uploaded',
        icon: 'schedule',
        videoItemMode: 'tile' as const,
        getVideosQuery: () => getRecentlyUploaded(),
      }
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = pageType
      throw new Error(`${pageType} is not handled`)
  }
}

export function useGetVideoPagesProps({ pageType }: getVideoPagesPropsInput): VideoPageProps {
  return getVideoPagesProps(
    { pageType },
    {
      getForYou: useGetForYouVideos,
      getMostPopular: useGetMostPopularVideos,
      getRecentlyUploaded: useGetRecentlyUplaoded,
      getTrending: useGetTrendingVideos,
    },
  )
}
