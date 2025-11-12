import type { InfiniteData } from '@tanstack/vue-query'

import type { PaginatedList } from '@/domain/shared/types'

export { StringUtils } from './string.utils'
export { VideoUtils } from './video.utils'

export function flattenPagination<T>(
  infiniteData: InfiniteData<PaginatedList<T>> | undefined,
): T[] {
  return infiniteData?.pages.flatMap((page) => page.items) ?? []
}
