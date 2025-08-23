import { ref, readonly, computed } from 'vue'
import { defineStore } from 'pinia'
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

export const useUiStore = defineStore('ui', () => {
  const _isSidebarOpen = ref(false)
  const isSidebarOpen = readonly(_isSidebarOpen)

  const breakpoints = useBreakpoints(breakpointsBootstrapV5)
  const isMobile = computed(() => breakpoints.smaller('md'))

  function toggleSidebar() {
    _isSidebarOpen.value = !_isSidebarOpen.value
  }

  return {
    isSidebarOpen,
    isMobile,
    toggleSidebar,
  }
})
