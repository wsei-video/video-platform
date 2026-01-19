<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import { useRouter } from 'vue-router'

import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
} from '@/components/ui/dropdown'
import { useAuthStore } from '@/store'

import AppIcon from '../ui/AppIcon.vue'
import ProfileBadge from '../ui/ProfileBadge.vue'

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')

const authStore = useAuthStore()
const router = useRouter()

const goToYourContent = () => {
  router.push({ name: 'your-content', params: { userId: authStore.currentAuth!.account.id } })
}

const goToLogin = () => {
  router.push({ name: 'login-page' })
}

const openHelp = () => {
  window.open('https://wsei-video.github.io/video-platform/#/', '_blank')
}
</script>

<template>
  <DropdownMenu class="profile-dropdown">
    <DropdownTrigger class="profile-dropdown__trigger">
      <ProfileBadge
        v-if="authStore.isAuthenticated"
        profile-image="https://picsum.photos/200"
        :profile-name="authStore.currentAuth!.account.name"
        :avatar-only="isMobile"
      />
      <AppIcon v-else class="fs-1" name="account_circle" />
    </DropdownTrigger>
    <DropdownContent class="profile-dropdown__content">
      <DropdownItem @click="openHelp">
        <AppIcon name="help" />
        <p>Help</p>
      </DropdownItem>
      <div v-if="authStore.isAuthenticated">
        <DropdownItem @click="goToYourContent">
          <AppIcon name="settings_video_camera" />
          <p>Your Content</p>
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem @click="authStore.handleLogout">
          <AppIcon name="logout" />
          <p>Logout</p>
        </DropdownItem>
      </div>
      <div v-else>
        <DropdownItem @click="goToLogin">
          <AppIcon name="login" />
          <p>Login</p>
        </DropdownItem>
      </div>
    </DropdownContent>
  </DropdownMenu>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.profile-dropdown__trigger {
  padding: 0.5rem 0.52rem;
  border-radius: $border-radius-md;
  &:hover {
    background-color: $accent;
  }
}
</style>
