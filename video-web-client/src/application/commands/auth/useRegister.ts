import { useMutation } from '@tanstack/vue-query'

import type { AccountCreateCommand } from '@/domain/account'
import { authRepository } from '@/infrastructure/video-api/auth'

export function useRegister() {
  return useMutation({
    mutationFn: (c: AccountCreateCommand) => authRepository.register(c),
  })
}
