import * as tus from 'tus-js-client'

import type { StaticIsAvailable, UploadProgress, UploadStrategy } from '@/domain/upload'
import { StaticImplements } from '@/infrastructure/video-api/shared/utils/type.utils'

@StaticImplements<StaticIsAvailable>()
export class TusUploadStrategy implements UploadStrategy {
  private tusUpload: tus.Upload | undefined

  async upload(file: File, onProgress: (p: UploadProgress) => void, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tusUpload = new tus.Upload(file, {
        endpoint: url,
        retryDelays: [0, 1000, 2000, 3000],
        metadata: {
          filetype: file.type,
          filename: file.name,
        },
        removeFingerprintOnSuccess: true,
        onError: (error) => {
          reject(error)
        },
        onProgress: (bytesSent, bytesTotal) => {
          if (bytesTotal !== 0) {
            onProgress({
              percentage: Math.round((bytesSent * 100) / bytesTotal),
            })
          }
        },
        onSuccess: () => {
          if (this.tusUpload) {
            console.log('UploadCompleted')
            resolve()
          }
        },
      })

      this.tusUpload.findPreviousUploads().then((previousUploads) => {
        console.log(`previous uploads: \n ${previousUploads}`)
        if (previousUploads.length) {
          this.tusUpload?.resumeFromPreviousUpload(previousUploads[previousUploads.length - 1])
        }

        this.tusUpload?.start()
      })
    })
  }

  static isAvailable(): boolean {
    return tus.isSupported
  }

  async resume(): Promise<void> {
    if (!this.tusUpload) throw new Error('Cannot resume. No upload object found')

    const prevUploads = await this.tusUpload.findPreviousUploads()
    if (prevUploads) {
      this.tusUpload?.resumeFromPreviousUpload(prevUploads[prevUploads.length - 1])
    }

    this.tusUpload?.start()
  }

  async pause(): Promise<void> {
    if (this.tusUpload) {
      this.tusUpload.abort()
    }
  }

  async abort(): Promise<void> {
    if (this.tusUpload) {
      this.tusUpload.abort(true)
    }
  }
}
