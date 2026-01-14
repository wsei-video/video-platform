<script setup lang="ts">
import { useRoute } from 'vue-router'

import { AppHeader } from '@/components/header'
import {
  AppSidebar,
  type SidebarLink,
  SidebarLinkItem,
  SidebarProfileInfo,
} from '@/components/sidebar'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppToast from '@/components/ui/AppToast.vue'
import { useUiStore } from '@/store'

defineProps<{
  sidebarLinks: SidebarLink[]
  profileInfo: boolean
}>()

const route = useRoute()
const uiStore = useUiStore()

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
    <div id="app-content" class="flex-grow-1 d-flex flex-column min-width-0">
      <AppHeader />
      <div class="flex-grow-1">
        <router-view :key="$route.fullPath" />
      </div>
    </div>
  </div>
  <AppSpinner v-if="uiStore.isRouteLoading || uiStore.isGlobalLoading" />
  <div class="position-fixed bottom-0 end-0 p-3">
    <transition name="fade">
      <AppToast
        v-if="uiStore.isToastVisible"
        :variant="uiStore.toastVariant"
        :title="uiStore.toastTitle"
        :message="uiStore.toastMessage"
        @close="uiStore.hideToast()"
      />
    </transition>
  </div>
</template>

<style scoped lang="scss">
@import '../styles/bootstrap/index.scss';

#app-content {
  width: 100%;
  height: 100vh;
}
</style>
