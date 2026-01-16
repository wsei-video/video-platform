import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useLogout, useRegister } from '@/application/commands/auth'
import { useLogin } from '@/application/commands/auth/useLogin'
import { useGetMe } from '@/application/queries/video'
import { useErrorNotifier } from '@/application/useErrorNotifier'
import type { AccountCreateCommand, AccountLoginCommand } from '@/domain/account'
import type { Auth } from '@/domain/auth'

import { useChannelStore } from './channel.store'

const authErrorMap: Record<string, string> = {
  InvalidCredentials: 'Invalid credentials',
  EmailAlreadyExists: 'User with this email already exists',
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const authToken = useStorage<string | undefined>('auth-token', undefined, localStorage)
  const channelStore = useChannelStore()

  const {
    data: loginData,
    isPending: isLoginPending,
    error: loginError,
    mutateAsync: login,
  } = useLogin()

  const {
    data: registerData,
    isPending: isRegisterPending,
    error: registerError,
    mutateAsync: register,
  } = useRegister()

  const {
    data: getmeData,
    isLoading: isGetUserPending,
    error: getUserError,
    refetch: refetchUser,
  } = useGetMe({
    enabled: computed(
      () =>
        !!authToken.value &&
        !loginData.value &&
        !registerData.value &&
        !isLoginPending.value &&
        !isRegisterPending.value,
    ),
    staleTime: 1000 * 10 * 60,
  })

  const { isPending: isLogoutPending, error: logoutError, mutateAsync: logout } = useLogout()

  async function handleLogin(c: AccountLoginCommand) {
    await login(c)

    if (!loginData.value) return
    authToken.value = loginData.value.accessToken
    authData.value = loginData.value
  }

  async function handleLogout() {
    await logout()
    if (logoutError.value || isLogoutPending.value) return

    authToken.value = undefined
    authData.value = undefined
    channelStore.setSelectedChannel(null)
    router.push({
      name: 'trending',
    })
  }

  async function handleRegister(c: AccountCreateCommand) {
    await register(c)
    if (!registerData.value) return

    authToken.value = registerData.value.accessToken
    authData.value = registerData.value
  }

  const authData = ref<Auth | undefined>()
  const currentAuth = computed(() => authData.value)
  const isAuthenticated = computed(() => !!currentAuth.value)

  const authError = computed(
    () => getUserError.value || loginError.value || registerError.value || logoutError.value,
  )
  useErrorNotifier(authError, authErrorMap)

  const isAuthPending = computed(
    () =>
      isGetUserPending.value ||
      isLoginPending.value ||
      isLogoutPending.value ||
      isRegisterPending.value,
  )

  watch(
    () => getmeData.value,
    (newAccount) => {
      authData.value = newAccount
    },
  )

  return {
    authToken,
    currentAuth,
    isAuthenticated,
    authError,
    isAuthPending,

    refetchUser,
    handleLogin,
    handleLogout,
    handleRegister,
  }
})
