import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useGetMe } from '@/application/queries/video'

export const useAuthStore = defineStore('auth', () => {
  const authToken = useStorage<string | undefined>('auth-token', undefined, localStorage)

  const {
    data: authData,
    isPending: isLoading,
    error,
  } = useGetMe({
    enabled: computed(() => !!authToken.value),
    staleTime: 1000 * 10 * 60,
  })
  const currentAuth = computed(() => authData.value)
  const isAuthenticated = computed(() => !!currentAuth.value)

  return {
    authToken,
    currentAuth,
    isAuthenticated,
    isLoading,
    error,
  }
})
