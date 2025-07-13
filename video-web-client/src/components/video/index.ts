export { default as VideoCard } from './VideoCard.vue'
export { default as VideoDuration } from './VideoDuration.vue'
export { default as VideoThumbnail } from './VideoThumbnail.vue'
export { default as VideoListItem } from './VideoListItem.vue'

export type ImageUrl = string
export type Seconds = number

export type Creator = {
  profileImage: ImageUrl
  profileName: string
}

export type VideoItem = {
  thumbnail: ImageUrl
  title: string
  description: string
  creator: Creator
  uploadDate: Date
  views: number
  duration: Seconds
}
