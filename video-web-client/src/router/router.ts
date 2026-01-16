import { createRouter, createWebHistory } from 'vue-router'

import type { SidebarLink } from '@/components/sidebar'
import { UnexpectedError } from '@/domain/shared/error'
import { useUiStore } from '@/store'
import WatchPage from '@/views/VideoPages/WatchPage/WatchPage.vue'

const VIDEO_PAGES_META_TAGS: SidebarLink[] = [
  { icon: 'mode_heat', to: '/trending', label: 'Trending' },
  { icon: 'trending_up', to: '/most-popular', label: 'Most popular' },
  { icon: 'schedule', to: '/recently-uploaded', label: 'Recently updated' },
  { icon: 'account_circle', to: '/for-you', label: 'For you' },
]

const STUDIO_BASE_LINK = 'studio'
const STUDIO_PAGE_META_TAGS: SidebarLink[] = [
  { icon: 'video_library', to: `/${STUDIO_BASE_LINK}/:userId/your-content`, label: 'Your content' },
  { icon: 'bar_chart_4_bars', to: `/${STUDIO_BASE_LINK}/:userId/statistics`, label: 'Statistics' },
  { icon: 'group', to: `/${STUDIO_BASE_LINK}/:userId/community`, label: 'Community' },
  {
    icon: 'manage_accounts',
    to: `/${STUDIO_BASE_LINK}/:userId/account-settings`,
    label: 'Settings',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    // Always scroll to top after route change
    return { top: 0 }
  },
  routes: [
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
    {
      path: '/login',
      name: 'login-page',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register-page',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/',
      name: 'VideoPage',
      component: () => import('@/views/MainLayout.vue'),
      props: {
        sidebarLinks: VIDEO_PAGES_META_TAGS,
        profileInfo: false,
      },
      children: [
        {
          path: '',
          redirect: '/trending',
        },
        {
          path: '/:videoId',
          name: 'watch-page',
          component: WatchPage,
        },
        {
          path: 'trending',
          name: 'trending',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
        },
        {
          path: 'most-popular',
          name: 'most-popular',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
        },
        {
          path: 'recently-uploaded',
          name: 'recently-uploaded',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
        },
        {
          path: 'for-you',
          name: 'for-you',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
        },
        {
          path: '/search',
          name: 'search',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
        },
        {
          path: 'dev',
          component: () => import('@/views/DevPage.vue'),
        },
      ],
    },
    {
      path: `/${STUDIO_BASE_LINK}/:userId`,
      name: 'StudioPage',
      component: () => import('@/views/MainLayout.vue'),
      props: {
        sidebarLinks: STUDIO_PAGE_META_TAGS,
        profileInfo: true,
      },
      children: [
        {
          path: '',
          redirect: (to) => `/studio/${to.params.userId}/your-content`,
        },
        {
          path: ':videoId',
          name: 'edit-video',
          props: true,
          component: () => import('@/views/Studio/EditVideo/EditVideoView.vue'),
        },
        {
          path: 'your-content',
          name: 'your-content',
          component: () => import('@/views/Studio/YourContent/YourContentView.vue'),
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/views/Studio/StatisticsView.vue'),
        },
        {
          path: 'community',
          name: 'community',
          component: () => import('@/views/Studio/CommunityView.vue'),
        },
        {
          path: 'account-settings',
          name: 'account-settings',
          component: () => import('@/views/Studio/AccountSettings/AccountSettingsView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const uiStore = useUiStore()
  uiStore.isRouteLoading = true
  next()
})

router.afterEach(() => {
  const uiStore = useUiStore()
  uiStore.isRouteLoading = false
})

router.onError(() => {
  const uiStore = useUiStore()
  uiStore.isRouteLoading = false
  uiStore.routingError = new UnexpectedError('Navigation')
})

export default router
