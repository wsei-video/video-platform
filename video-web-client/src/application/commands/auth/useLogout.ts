import { useMutation } from '@tanstack/vue-query'

import { authRepository } from '@/infrastructure/video-api/auth'

export function useLogout() {
  return useMutation({
    mutationFn: () => authRepository.logout(),
  })
}
