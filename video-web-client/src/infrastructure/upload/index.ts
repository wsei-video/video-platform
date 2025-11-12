import type { UploadFactory, UploadType } from '@/domain/upload'

import { uploadClientSimple } from './upload.client'
import { HttpUploadStrategy } from './upload.http-strategy'
import { TusUploadStrategy } from './upload.tus-strategy'

export * from './upload.api'
export * from './upload.client'

export const uploadFactory: UploadFactory = (uploadType: UploadType) => {
  if (uploadType === 'simple') return new HttpUploadStrategy(uploadClientSimple)

  if (!TusUploadStrategy.isAvailable()) {
    console.warn('Resumable upload not available')
    return new HttpUploadStrategy(uploadClientSimple)
  }

  return new TusUploadStrategy()
}
