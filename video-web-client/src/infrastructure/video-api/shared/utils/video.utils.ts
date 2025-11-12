export class VideoUtils {
  /**
   * Formats time in seconds into string in format of `[HH:]mm:ss`.
   */
  public static formatDuration(timeInSeconds: number): string {
    const flooredTimeInSeconds = Math.floor(timeInSeconds)
    const hours = Math.floor(flooredTimeInSeconds / 3600)
    const minutes = Math.floor((flooredTimeInSeconds % 3600) / 60)
    const seconds = flooredTimeInSeconds % 60
    const pad = (component: number) => component.toString().padStart(2, '0')
    const formattedTime = `${pad(minutes)}:${pad(seconds)}`
    return hours === 0 ? formattedTime : `${pad(hours)}:${formattedTime}`
  }

  /**
   * Returns a human-readable string representing how many days have
   * passed since a given date.
   */
  public static formatTimeSince(referenceDate: Date): string {
    const now = new Date()
    const differenceInMs = now.getTime() - referenceDate.getTime()
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

  public static formatDate(referenceDate: Date, locale: string = 'en-US'): string {
    const formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false,
    })

    return formatter.format(referenceDate)
  }

  /**
   * Formats a number into a compact, human-readable string using
   * locale-specific notation.
   */
  public static formatCountCompact(count: number, locale: string = 'en-US'): string {
    const formatter = new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    })
    return formatter.format(count)
  }

  /**
   * Formats a number using grouping, specific to provided locale
   */
  public static formatCount(count: number, locale = 'pl-PL') {
    const formatter = new Intl.NumberFormat(locale, {
      useGrouping: true,
    })
    return formatter.format(count)
  }
}
