import { useMutation } from '@tanstack/vue-query'

import type { UploadProgress, UploadStrategy } from '@/domain/upload'

export type UploadProps = {
  file: File
  url: string
  onProgress: (p: UploadProgress) => void
}

export function useUploadFile(strategy: UploadStrategy) {
  return useMutation({
    mutationFn: ({ file, url, onProgress }: UploadProps) => strategy.upload(file, onProgress, url),
    retry: false,
  })
}
