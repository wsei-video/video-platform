import { StorageConstants } from '@video/lib/storage';
import { SUPPORTED_VIDEO_FORMATS, VideoCodec, VideoResolution } from '@video/lib/media';

import { MediaProbe } from '../decoder';

export class IdentifyService {
  public identify(meta: MediaProbe): IdentifySpecification {
    const specification: IdentifySpecification = {
      audio: {
        included: false,
        duration: 0,
      },
      video: {
        tasks: [],
        sectionCount: 0,
        formatHeights: [],
      },
    };

    const audioStream = meta.streams.find(stream => stream.codec_type === 'audio');

    if (audioStream) {
      specification.audio.included = true;
      specification.audio.duration = parseFloat(audioStream.duration ?? '0');
    }

    const videoStream = meta.streams.find(stream => stream.codec_type === 'video');
    if (!videoStream) return specification;

    const width = videoStream.width;
    const height = videoStream.height;
    const durationString = videoStream.duration;
    const frameRateString = videoStream.r_frame_rate;

    if (!width) throw new Error('Video stream has no width');
    if (!height) throw new Error('Video stream has no height');
    if (!durationString) throw new Error('Video stream has no duration');
    if (!frameRateString) throw new Error('Video stream has no frame rate');

    const duration = parseFloat(durationString);
    const frameRate = this.parseFractionString(frameRateString);

    const segmentCount = Math.ceil(duration / StorageConstants.hlsSegmentDuration);
    const sectionCount = Math.ceil(segmentCount / StorageConstants.hlsSectionMaxSegments);

    specification.video.sectionCount = sectionCount;

    const aspectRatio = width / height;
    const isPortrait = aspectRatio < 1;

    for (const format of SUPPORTED_VIDEO_FORMATS) {
      const fps = this.divideUntilLessThanOrEqual(frameRate, format.fpsCap);
      const resolution: VideoResolution = { width: 0, height: 0 };

      if (isPortrait) {
        resolution.width = format.resolution.height;
        resolution.height = Math.floor(format.resolution.height / aspectRatio);
        if (resolution.height % 2 !== 0) resolution.height++;
        if (format.resolution.width > height) continue;
      } else {
        resolution.width = Math.floor(format.resolution.height * aspectRatio);
        if (resolution.width % 2 !== 0) resolution.width++;
        resolution.height = format.resolution.height;
        if (format.resolution.height > height) continue;
      }

      specification.video.formatHeights.push(resolution.height);

      for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex++) {
        const isLastSection = sectionIndex + 1 === sectionCount;

        specification.video.tasks.push({
          input: {
            duration,
          },
          output: {
            ...resolution,
            fps,
            codec: format.codec,
            bpp: format.bitrate.bpp,
          },
          split: {
            duration: isLastSection ? null : StorageConstants.hlsSectionMaxDuration,
            segmentStartIndex: sectionIndex * StorageConstants.hlsSectionMaxSegments,
            from: StorageConstants.hlsSectionMaxDuration * sectionIndex,
          },
        });
      }
    }

    return specification;
  }

  private parseFractionString(fraction: string): number {
    const [dividend = 0, divisor = 1] = fraction.split('/').map(value => parseFloat(value));
    return dividend / divisor;
  }

  private divideUntilLessThanOrEqual(value: number, maxValue: number): number {
    while (value > maxValue) {
      value = Math.round(value / 2);
    }
    return value;
  }
}

export interface IdentifySpecification {
  /** Audio specification. */
  audio: {
    /** Indicates whether audio stream is present in the media. */
    included: boolean;

    /** Audio duration in seconds. */
    duration: number;
  };
  /** Video specification. */
  video: {
    /** List of AdaptiveVideo tasks that should be scheduled for video transcoding. */
    tasks: IdentifyVideoTaskSpecification[];

    /** Number of video sections the video was divided in for split-and-stitch transcoding. */
    sectionCount: number;

    /** Lists of format heights that should be scheduled for transcoding. */
    formatHeights: number[];
  };
}

export interface IdentifyVideoTaskSpecification {
  /** Input video specification. */
  input: {
    /** Input video duration in seconds. */
    duration: number;
  };

  /** Output video specification. */
  output: {
    /** Output video width. */
    width: number;

    /** Output video height. */
    height: number;

    /** Output video framerate. */
    fps: number;

    /** Video codec information. */
    codec: VideoCodec;

    /** Bits per pixel. */
    bpp: number;
  };

  /** Split-and-stitch encoding options. */
  split: {
    /** Start time of the video in seconds when the encoding should start. */
    from: number;

    /**
     * Duration of the video in seconds that the encoding should work on.
     * If `null` the encoding will work until the end of the video.
     */
    duration: number | null;

    /** Index of the first segment that should be produced during encoding. */
    segmentStartIndex: number;
  };
}
