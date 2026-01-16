import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

import type { ToastVariant } from '@/components/ui'

export const useUiStore = defineStore('ui', () => {
  const _isSidebarOpen = ref(false)
  const isSidebarOpen = readonly(_isSidebarOpen)
  const isRouteLoading = ref(false)
  const routingError = ref<Error | undefined>()
  const isSearchBarActive = ref(false)

  const isGlobalLoading = ref(false)

  const isToastVisible = ref(false)
  const toastMessage = ref('')
  const toastTitle = ref<string | undefined>(undefined)
  const toastVariant = ref<ToastVariant>('info')
  let toastTimeout: ReturnType<typeof setTimeout> | null = null

  function toggleSidebar() {
    _isSidebarOpen.value = !_isSidebarOpen.value
  }

  function showToast(payload: {
    message: string
    variant?: ToastVariant
    title?: string
    duration?: number
  }) {
    toastMessage.value = payload.message
    toastVariant.value = payload.variant || 'info'
    toastTitle.value = payload.title
    isToastVisible.value = true

    if (toastTimeout) {
      clearTimeout(toastTimeout)
    }

    if (payload.duration !== 0) {
      toastTimeout = setTimeout(() => {
        hideToast()
      }, payload.duration || 5000)
    }
  }

  function hideToast() {
    isToastVisible.value = false
  }

  return {
    isSidebarOpen,
    isSearchBarActive,
    isRouteLoading,
    routingError,
    toggleSidebar,

    isGlobalLoading,

    isToastVisible,
    toastMessage,
    toastTitle,
    toastVariant,
    showToast,
    hideToast,
  }
})
