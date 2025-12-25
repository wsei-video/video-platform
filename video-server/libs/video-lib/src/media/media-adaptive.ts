export class MediaAdaptiveFormat {
  public static readonly Hls = new MediaAdaptiveFormat('hls', 'm3u8');
  public static readonly Dash = new MediaAdaptiveFormat('dash', 'mpd');
  public static readonly Formats = [this.Hls, this.Dash];

  private constructor(
    public readonly name: string,
    public readonly extension: string,
  ) {}
}
