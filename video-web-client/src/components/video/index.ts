export { default as VideoCard } from './VideoCard.vue'
export { default as VideoDuration } from './VideoDuration.vue'

export type ImageUrl = string
export type Seconds = number

export type Creator = {
  profileImage: ImageUrl
  profileName: string
}

export type VideoCard = {
  thumbnail: ImageUrl
  title: string
  creator: Creator
  uploadDate: Date
  views: number
  duration: Seconds
}
