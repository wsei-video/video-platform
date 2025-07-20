<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

import { useUiStore } from '@/store'

const uiStore = useUiStore()
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')

import WatchMeLogo from '@/assets/watch-me-logo.svg'
</script>
<template>
  <nav
    id="sidebar"
    :class="{
      closed: !uiStore.isSidebarOpen,
      'position-fixed': isMobile,
      'position-sticky': !isMobile,
    }"
  >
    <div class="position-relative">
      <div id="sidebar-logo">
        <img :src="WatchMeLogo" alt="WatchMe logo" id="watch-me" />
      </div>
    </div>
    <div
      v-show="$slots.header"
      class="sidebar-header w-100"
      :class="{ 'header-visible': uiStore.isSidebarOpen }"
    >
      <slot name="header" />
    </div>
    <div class="sidebar-body align-self-start w-100">
      <slot name="body" />
    </div>
  </nav>
  <div v-if="isMobile" id="sidebar-shadow"></div>
  <div
    v-if="isMobile && uiStore.isSidebarOpen"
    class="backdrop"
    @click="uiStore.toggleSidebar()"
  ></div>
</template>

<style lang="scss">
@import '../../styles/bootstrap/index.scss';

#sidebar {
  top: 0;
  left: 0;
  height: 100vh;
  padding: 0.5rem 1rem;
  min-width: $sidebar-width;
  max-width: $sidebar-width;
  z-index: $zindex-sidebar;

  display: flex;
  gap: 2rem;
  flex-direction: column;
  box-shadow: 3px 0px 10px black;
  background-color: $secondary;
  overflow-x: hidden;
  text-wrap: nowrap;

  transition: 0.35s ease-in-out;

  &.closed {
    min-width: 60px;
    max-width: 60px;
    padding: 0.5rem 5px;
  }

  #sidebar-logo {
    padding: 0.5rem 0.35rem;
    position: sticky;
    left: 0px;
    width: fit-content;
    margin: 0 auto;
  }

  .sidebar-header {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition:
      opacity 0.3s ease-in-out,
      max-height 0.3s ease-in-out;

    &.header-visible {
      opacity: 1;
      max-height: $sidebar-header-height;
    }
  }
}

#sidebar-shadow {
  min-width: 60px;
  max-width: 60px;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: $zindex-backdrop;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
