export { default as VideoCard } from './VideoCard.vue'
export { default as VideoDuration } from './VideoDuration.vue'

export type ImageUrl = string
export type Seconds = number

export type VideoCard = {
  thumbnail: ImageUrl
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  creator: any
  uploadDate: Date
  views: number
  duration: Seconds
}

export function formatUploadTime(uploadDate: Date): string {
  const now = new Date()
  const differenceInMs = now.getTime() - uploadDate.getTime()
  const differenceInDays = Math.floor(differenceInMs / 84400000)

  switch (differenceInDays) {
    case 0:
      return 'today'
    case 1:
      return '1 day ago'
    default:
      return `${differenceInDays} days ago`
  }
}

export function formatViews(views: number, locale: string = 'en-US'): string {
  const formatter = new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
  return formatter.format(views)
}

export function formatDuration(duration: Seconds): string {
  const date = new Date(duration * 1000)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()

  let result = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
  if (hours > 0) {
    result = hours.toString().padStart(2, '0') + ':' + result
  }

  return result
}
