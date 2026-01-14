import { type ComputedRef, type Ref, watch } from 'vue'

import { getUserMessage } from '@/domain/shared/error'
import { useUiStore } from '@/store'

export function useErrorNotifier(
  error: Ref<Error | null | undefined> | ComputedRef<Error | null | undefined>,
  contextCustomMessages?: Record<string, string>,
) {
  const uiStore = useUiStore()

  watch(
    () => error.value,
    (error) => {
      const userMessage = getUserMessage(error, contextCustomMessages)
      uiStore.showToast(userMessage)
    },
  )
}
