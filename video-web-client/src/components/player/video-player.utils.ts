export class VideoPlayerUtils {
  /**
   * Calculates the total buffered duration ahead of the current playback time in a video element.
   *
   * This function analyzes the `TimeRanges` object returned by `video.buffered` and determines
   * how much of the video is buffered from the current playback position forward.
   *
   * It includes only those buffered ranges that begin at or after the current time, or those
   * that the current time is already within. Gaps between ranges are not counted.
   */
  public static calculateBufferedDuration(video: HTMLVideoElement): number {
    const buffered = video.buffered
    const currentTime = video.currentTime

    // Start at the current time, don't track what has been buffered before that as
    // this information is not needed.
    let bufferedDuration = currentTime

    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i)
      const end = buffered.end(i)

      // Find a continues sequence of buffered time ranges ahead of the current playback
      // time. Stop processing if you encounter a gap between ranges.
      if (start <= bufferedDuration && end > currentTime) {
        if (currentTime >= start && currentTime <= end) {
          // The current playback time is inside the buffered range.
          // Calculate the buffered time after the current playback time.
          bufferedDuration += end - currentTime
        } else if (start > currentTime) {
          // The buffered range is entirely ahead of the current playback time.
          // Add the entire range length to the final duration.
          bufferedDuration += end - start
        }
      }
    }

    return bufferedDuration
  }
}
