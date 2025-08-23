<script setup lang="ts">
import { useUiStore } from '@/store'

import { AppIcon, AppInput, ProfileBadge } from '@/components/ui'

const uiStore = useUiStore()
</script>

<template>
  <header :class="{ mobile: uiStore.isMobile }">
    <AppIcon id="menu-button" name="menu" @click="uiStore.toggleSidebar()" />
    <div class="search-bar">
      <AppInput v-if="!uiStore.isMobile" variant="dark" placeholder="Search..." />
      <AppIcon name="search" />
    </div>
    <RouterLink class="header-link" :to="{ name: 'your-content', params: { userId: '123' } }">
      <ProfileBadge
        profile-image="https://picsum.photos/200"
        profile-name="John Doe"
        :avatar-only="uiStore.isMobile"
      />
    </RouterLink>
  </header>
</template>
<style lang="scss">
@import '../../styles/bootstrap/index.scss';

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  z-index: $zindex-header;

  background-color: $secondary;
  padding: 0.625rem 1.25rem;
  width: 100%;

  position: sticky;
  top: 0;

  #menu-button {
    font-size: 2rem;
    cursor: pointer;
  }

  &.mobile #menu-button {
    margin-right: auto;
  }

  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;

    input {
      padding-right: 3rem;
    }

    span {
      font-size: 2rem;
    }
  }

  &:not(.mobile) .search-bar {
    position: relative;
    width: 45%;
  }

  &:not(.mobile) .search-bar span {
    margin: 0;
    font-size: 1.5rem;
    display: inline-block;
    transform: scaleX(-1) translateY(-50%);
    position: absolute;
    right: 10px;
    top: 50%;
    color: $input-placeholder-color;
    padding-right: 10px;
    border-right: 1px solid $input-placeholder-color;
  }
}
</style>
