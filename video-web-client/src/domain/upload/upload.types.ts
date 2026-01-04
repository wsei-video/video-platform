export interface UploadResult {
  file: File
  id: string
}

export interface UploadVideoInput {
  file: File
  uploadType: UploadType
  uploadId: string
  onProgress: (p: UploadProgress) => void
}

export interface UploadProgress {
  percentage: number
}
export type UploadType = 'simple' | 'resumable'

export type UploadFactory = (uploadType: UploadType) => UploadStrategy

export interface StaticIsAvailable {
  isAvailable(): boolean
}

export interface UploadStrategy {
  upload(file: File, onProgress: (p: UploadProgress) => void, url: string): Promise<void>
  pause(): Promise<void>
  resume(): Promise<void>
  abort(): Promise<void>
}
