import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const _isSidebarOpen = ref(false)
  const isSidebarOpen = readonly(_isSidebarOpen)

  function toggleSidebar() {
    _isSidebarOpen.value = !_isSidebarOpen.value
  }

  return {
    isSidebarOpen,
    toggleSidebar,
  }
})
