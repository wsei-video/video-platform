<script setup lang="ts">
import { useGetAccountSettingsPage } from '@/application'
import ChannelList from '@/components/account/ChannelList.vue'
import UserProfileCard from '@/components/account/UserProfileCard.vue'
import { AppSpinner } from '@/components/ui'

const { isLoading } = useGetAccountSettingsPage()
</script>

<template>
  <div class="account-settings-view position-relative">
    <UserProfileCard />
    <ChannelList />
    <AppSpinner mode="overlay" v-if="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/bootstrap/index.scss';

.account-settings-view {
  display: grid;
  grid-template-columns: 21.875rem 1fr;
  gap: 2rem;
  padding: 2rem;
  height: 100%;

  @include media-breakpoint-down(lg) {
    grid-template-columns: 1fr;
  }
}
</style>
