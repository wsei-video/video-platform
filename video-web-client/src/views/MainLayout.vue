<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { SidebarMetaLinks } from '@/router'

import { AppSidebar, SidebarLink, SidebarProfileInfo } from '@/components/sidebar'
import { AppHeader } from '@/components/header'

const route = useRoute()

const sidebarLinks = computed<SidebarMetaLinks[]>(() => {
  return route.meta.sidebar?.links || []
})
const profileInfo = computed(() => {
  return route.meta.sidebar?.profileInfo || false
})

const processLinkPath = (to: string): string => {
  return to.replace('/:userId', `/${route.params.userId}`)
}
</script>
<template>
  <div class="d-flex">
    <AppSidebar>
      <template v-if="profileInfo" #header>
        <SidebarProfileInfo profile-image="https://picsum.photos/200" profile-name="John Doe" />
      </template>
      <template #body>
        <SidebarLink
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="processLinkPath(link.to)"
          :icon="link.icon"
        >
          {{ link.label }}
        </SidebarLink>
      </template>
    </AppSidebar>
    <div id="app-content" class="w-100">
      <AppHeader />
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
#app-content {
  width: 100%;
}
</style>
