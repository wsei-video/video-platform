import type { AxiosInstance } from 'axios'

import type { StaticIsAvailable, UploadProgress, UploadStrategy } from '@/domain/upload'
import { StaticImplements } from '@/infrastructure/video-api/shared/utils/type.utils'

@StaticImplements<StaticIsAvailable>()
export class HttpUploadStrategy implements UploadStrategy {
  constructor(
    private client: AxiosInstance,
    private controller: AbortController = new AbortController(),
  ) {}

  async upload(file: File, onProgress: (p: UploadProgress) => void, url: string): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)
    await this.client.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          onProgress({
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          })
        }
      },
    })

    return
  }

  static isAvailable(): boolean {
    return true
  }

  async pause(): Promise<void> {
    await this.abort()
  }

  async resume(): Promise<void> {
    throw new Error('Cannot resume http uypload')
  }

  async abort(): Promise<void> {
    this.controller.abort()
  }
}
