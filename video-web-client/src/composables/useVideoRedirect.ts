import type { RedirectTo } from '@/components/video/VideoItem.vue'
import type { Video } from '@/domain/video'
import { useAuthStore } from '@/store/auth.store'

export type VideoRedirect = 'studio' | 'watch-page'

export const useVideoRedirect = (to: VideoRedirect, video: Video): RedirectTo => {
  const authStore = useAuthStore()
  switch (to) {
    case 'studio':
      return {
        name: 'edit-video',
        params: { userId: authStore.currentAuth?.account.id, videoId: video.id },
      }
    case 'watch-page':
      return { name: 'watch-page', params: { videoId: video.id } }
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = to
      throw new Error('Not all redirect options handled')
  }
}
