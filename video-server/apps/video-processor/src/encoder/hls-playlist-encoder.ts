import { StorageConstants } from '@video/lib/storage';

export class HlsPlaylistEncoder {
  /** Creates an HLS Rendition playlist for a video with given duration. */
  public static encode(duration: number): string {
    const playlist = [
      '#EXTM3U',
      '#EXT-X-VERSION:7',
      `#EXT-X-TARGETDURATION:${StorageConstants.hlsSegmentDuration}`,
      '#EXT-X-MEDIA-SEQUENCE:0',
      '#EXT-X-PLAYLIST-TYPE:VOD',
      `#EXT-X-MAP:URI="${StorageConstants.hlsInit}"`,
    ];

    const segmentCount = Math.ceil(duration / StorageConstants.hlsSegmentDuration);
    const lastSegmentDuration = duration % StorageConstants.hlsSegmentDuration || StorageConstants.hlsSegmentDuration;

    for (let index = 0; index < segmentCount; index++) {
      const segmentDuration = index + 1 === segmentCount ? lastSegmentDuration : StorageConstants.hlsSegmentDuration;
      playlist.push(`#EXTINF:${segmentDuration.toFixed(6)},`);
      playlist.push(`segment_${index.toString(10).padStart(6, '0')}.m4s`);
    }

    playlist.push('#EXT-X-ENDLIST');

    return playlist.join('\n');
  }
}
