export class StringUtils {
  /**
   * Capitalizes first letter of string.
   */
  public static capitalize(s: string): string {
    if (s.length < 1) return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }
}
