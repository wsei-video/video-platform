<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

import { AppIcon } from '@/components/ui'
import { useUiStore } from '@/store'

import ProfileDropdown from './ProfileDropdown.vue'
import SearchBar from './SearchBar.vue'

const uiStore = useUiStore()

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')
</script>

<template>
  <header :class="{ mobile: isMobile }">
    <AppIcon id="menu-button" name="menu" @click="uiStore.toggleSidebar()" />
    <SearchBar />
    <ProfileDropdown />
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
    color: $white;
  }

  &.mobile #menu-button {
    margin-right: auto;
  }
}
</style>
