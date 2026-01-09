import { useMutation } from '@tanstack/vue-query'

import type { AccountLoginCommand } from '@/domain/account'
import { authRepository } from '@/infrastructure/video-api/auth'

export function useLogin() {
  return useMutation({
    mutationFn: (c: AccountLoginCommand) => authRepository.login(c),
  })
}
