import type { VideoVisibility } from './video.model'

export interface VideoCreateCommand {
  channelId: string
  title: string
}

export interface VideoUpdateCommand {
  videoId: string
  title?: string
  description?: string
  visibility?: VideoVisibility
}
