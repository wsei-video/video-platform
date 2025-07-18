export { default as router } from './router'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    sidebar?: {
      profileInfo: boolean
      links: SidebarMetaLinks[]
    }
  }
}

export type SidebarMetaLinks = {
  icon: string
  to: string
  label: string
}
