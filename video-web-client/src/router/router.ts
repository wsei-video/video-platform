import { createRouter, createWebHistory } from 'vue-router'

import type { SidebarLink } from '@/components/sidebar'

const VIDEO_PAGES_META_TAGS: SidebarLink[] = [
  { icon: 'mode_heat', to: '/trending', label: 'Trending' },
  { icon: 'trending_up', to: '/most-popular', label: 'Most popular' },
  { icon: 'schedule', to: '/recently-uploaded', label: 'Recently updated' },
  { icon: 'account_circle', to: '/for-you', label: 'For you' },
]

const STUDIO_PAGE_META_TAGS: SidebarLink[] = [
  { icon: 'mode_heat', to: '/:userId/your-content', label: 'Your content' },
  { icon: 'trending_up', to: '/:userId/statistics', label: 'Statistics' },
  { icon: 'schedule', to: '/:userId/community', label: 'Community' },
  { icon: 'account_circle', to: '/:userId/settings', label: 'Settings' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import('@/views/LoginPage.vue'),
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
          component: () => import('@/views/VideoPages/WatchPage/WatchPage.vue'),
        },
        {
          path: 'trending',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
          props: {
            pageType: 'trending',
          },
        },
        {
          path: 'most-popular',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
          props: {
            pageType: 'most-popular',
          },
        },
        {
          path: 'recently-uploaded',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
          props: {
            pageType: 'recently-uploaded',
          },
        },
        {
          path: 'for-you',
          component: () => import('@/views/VideoPages/VideoPageLayout.vue'),
          props: {
            pageType: 'for-you',
          },
        },
        {
          path: 'dev',
          component: () => import('@/views/DevPage.vue'),
        },
      ],
    },
    {
      path: '/:userId',
      name: 'StudioPage',
      component: () => import('@/views/MainLayout.vue'),
      props: {
        links: STUDIO_PAGE_META_TAGS,
        profileInfo: true,
      },
      children: [
        {
          path: '',
          redirect: (to) => `/${to.params.userId}/your-content`,
        },
        {
          path: 'your-content',
          component: () => import('@/views/Studio/YourContentView.vue'),
        },
        {
          path: 'statistics',
          component: () => import('@/views/Studio/StatisticsView.vue'),
        },
        {
          path: 'community',
          component: () => import('@/views/Studio/CommunityView.vue'),
        },
        {
          path: 'settings',
          component: () => import('@/views/Studio/SettingsView.vue'),
        },
      ],
    },
  ],
})

// TODO: use 'props:' to pass meta tags to studio page

export default router
