<script setup lang="ts">
import { useRoute } from 'vue-router'

import { AppHeader } from '@/components/header'
import {
  AppSidebar,
  type SidebarLink,
  SidebarLinkItem,
  SidebarProfileInfo,
} from '@/components/sidebar'

defineProps<{
  sidebarLinks: SidebarLink[]
  profileInfo: boolean
}>()

const route = useRoute()

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
        <SidebarLinkItem
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="processLinkPath(link.to)"
          :icon="link.icon"
        >
          {{ link.label }}
        </SidebarLinkItem>
      </template>
    </AppSidebar>
    <div id="app-content" class="w-100">
      <AppHeader />
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<style scoped lang="scss">
#app-content {
  width: 100%;
  height: 100vh;
}
</style>
