export class VideoPlayerUtils {
  public static formatTime(timeInSeconds: number): string {
    const flooredTimeInSeconds = Math.floor(timeInSeconds)
    const hours = Math.floor(flooredTimeInSeconds / 3600)
    const minutes = Math.floor((flooredTimeInSeconds % 3600) / 60)
    const seconds = flooredTimeInSeconds % 60
    const pad = (component: number) => component.toString().padStart(2, '0')
    const formattedTime = `${pad(minutes)}:${pad(seconds)}`
    return hours === 0 ? formattedTime : `${pad(hours)}:${formattedTime}`
  }

  public static calculateBufferedDuration(video: HTMLVideoElement): number {
    const buffered = video.buffered
    const currentTime = video.currentTime

    let bufferedDuration = currentTime

    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i)
      const end = buffered.end(i)

      if (start <= bufferedDuration && end > currentTime) {
        if (currentTime >= start && currentTime <= end) {
          bufferedDuration += end - currentTime
        } else if (start > currentTime) {
          bufferedDuration += end - start
        }
      }
    }

    return bufferedDuration
  }
}
