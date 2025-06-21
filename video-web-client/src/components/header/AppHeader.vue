<script setup lang="ts">
import { useUiStore } from '@/store/ui.store'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'

import AppIcon from '../ui/AppIcon.vue'
import AppInput from '../ui/AppInput.vue'
import ProfileBadge from '../ui/ProfileBadge.vue'

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')
const uiStore = useUiStore()
</script>

<template>
  <header :class="{ mobile: isMobile }">
    <AppIcon id="menu-button" name="menu" @click="uiStore.toggleSidebar()" />
    <div class="search-bar">
      <AppInput v-if="!isMobile" variant="dark" placeholder="Search..." />
      <AppIcon name="search" />
    </div>
    <ProfileBadge
      profile-image="https://picsum.photos/200"
      profile-name="John Doe"
      :avatar-only="isMobile"
    />
  </header>
</template>
<style lang="scss">
@import '../../styles/bootstrap/index.scss';

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;

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
