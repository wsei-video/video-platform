import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const _isSidebarOpen = ref(false)
  const isSidebarOpen = readonly(_isSidebarOpen)
  const isRouteLoading = ref(false)
  const routingError = ref<Error | undefined>()
  const isSearchBarActive = ref(false)

  function toggleSidebar() {
    _isSidebarOpen.value = !_isSidebarOpen.value
  }

  return {
    isSidebarOpen,
    isSearchBarActive,
    isRouteLoading,
    routingError,
    toggleSidebar,
  }
})
