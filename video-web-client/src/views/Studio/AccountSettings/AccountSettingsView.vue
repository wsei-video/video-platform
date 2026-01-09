<script setup lang="ts">
import { useGetAccountSettingsPage } from '@/application'
import ChannelList from '@/components/account/ChannelList.vue'
import UserProfileCard from '@/components/account/UserProfileCard.vue'

const { isLoading, error } = useGetAccountSettingsPage()
</script>

<template>
  <div class="account-settings-view">
    <UserProfileCard />
    <ChannelList />
    <p v-if="isLoading">Loading ...</p>
    <p v-if="error">{{ error.message }}</p>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/bootstrap/index.scss';

.account-settings-view {
  display: grid;
  grid-template-columns: 21.875rem 1fr;
  gap: 2rem;
  padding: 2rem;

  @include media-breakpoint-down(lg) {
    grid-template-columns: 1fr;
  }
}
</style>
