import { useQuery } from '@tanstack/vue-query'

import type { Auth } from '@/domain/auth'
import { authRepository } from '@/infrastructure/video-api/auth'
import type { appUseQueryOptions } from '@/infrastructure/video-api/shared/utils/type.utils'

export function useGetMe(options: appUseQueryOptions<Auth> = {}) {
  return useQuery<Auth>({
    queryKey: ['getMe'],
    queryFn: () => authRepository.getCurrentSession(),
    retry: false,
    ...options,
  })
}
