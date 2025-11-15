export class StorageConstants {
  /** S3 region required for AWS SDK ignored by Min.io. */
  public static readonly region = 'on-premise';

  /** S3 bucket for storing uploaded files. */
  public static readonly uploadsBucket = 'uploads';

  /** S3 bucket for storing transcoded files. */
  public static readonly mediaBucket = 'media';

  /** HLS Rendition playlist file name. */
  public static readonly hlsStreamPlaylist = 'playlist.m3u8';

  /** HLS Multivariant playlist file name. */
  public static readonly hlsMasterPlaylist = 'master.m3u8';

  /** HLS fMP4 init file name. */
  public static readonly hlsInit = 'init.mp4';

  /** HLS regex for extracting segment number from a segment file. */
  public static readonly hlsSegmentRegex = /^segment_(\d+)\.m4s$/;

  /** HLS max segment duration in seconds. */
  public static readonly hlsSegmentDuration = 6;

  /** Maximum number of video segments that can be generated in one split-and-stitch encoding job. */
  public static readonly hlsSectionMaxSegments = 3;

  /** Maximum duration of video section that can be processed by single split-and-stitch encoding job. */
  public static readonly hlsSectionMaxDuration = this.hlsSegmentDuration * this.hlsSectionMaxSegments;
}
