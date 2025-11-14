import type { Video } from '@/services/api'
import type { RedirectTo } from '@/components/video/VideoItem.vue'

export type VideoRedirect = 'studio' | 'watch-page'

const TEMP_USERID = '123'

export const useVideoRedirect = (to: VideoRedirect, video: Video): RedirectTo => {
  switch (to) {
    case 'studio':
      return { name: 'edit-video', params: { userId: TEMP_USERID, videoId: video.id } }
    case 'watch-page':
      return { name: 'watch-page', params: { videoId: video.id } }
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = to
      throw new Error('Not all redirect options handled')
  }
}
