import { createRouter, createWebHistory } from 'vue-router'
import type { SidebarMetaLinks } from './index'

const WATCH_PAGE_META_TAGS: SidebarMetaLinks[] = [
  { icon: 'mode_heat', to: '/trending', label: 'Trending' },
  { icon: 'trending_up', to: '/most-popular', label: 'Most popular' },
  { icon: 'schedule', to: '/recently-updated', label: 'Recently updated' },
  { icon: 'account_circle', to: '/for-you', label: 'For you' },
]

const STUDIO_PAGE_META_TAGS: SidebarMetaLinks[] = [
  { icon: 'mode_heat', to: '/:userId/your-content', label: 'Your content' },
  { icon: 'trending_up', to: '/:userId/statistics', label: 'Statistics' },
  { icon: 'schedule', to: '/:userId/community', label: 'Community' },
  { icon: 'account_circle', to: '/:userId/settings', label: 'Settings' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WatchPage',
      component: () => import('@/views/MainLayout.vue'),
      meta: {
        sidebar: {
          links: WATCH_PAGE_META_TAGS,
          profileInfo: false,
        },
      },
      children: [
        {
          path: '',
          redirect: '/trending',
        },
        {
          path: 'trending',
          component: () => import('@/views/WatchPage/TrendingView.vue'),
        },
        {
          path: 'most-popular',
          component: () => import('@/views/WatchPage/MostPopularView.vue'),
        },
        {
          path: 'recently-updated',
          component: () => import('@/views/WatchPage/RecentlyUpdatedView.vue'),
        },
        {
          path: 'for-you',
          component: () => import('@/views/WatchPage/ForYouView.vue'),
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
      meta: {
        sidebar: {
          links: STUDIO_PAGE_META_TAGS,
          profileInfo: true,
        },
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

export default router
