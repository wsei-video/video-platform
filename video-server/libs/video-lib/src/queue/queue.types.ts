import { VideoCodec } from '../media';

export enum QueueExchange {
  /** RabbitMQ exchange used to publish tasks for the Video Processor. */
  Media = 'media.direct',
}

/** List of tasks supported by the Video Processor. */
export enum QueueTask {
  /** Checks if the uploaded file is a multimedia file and schedules media processing jobs. */
  Identify = 'identify',

  /** Produces adaptive bitrate streaming video files for a section of the video and in the given resolution. */
  AdaptiveVideo = 'adaptive_video',

  /** Produces adaptive bitrate streaming audio files for the given video. */
  AdaptiveAudio = 'adaptive_audio',

  /** Produces scrubber image allowing the usr to preview the frames near given playback time. */
  ScrubberImage = 'scrubber_image',
}

/** Base message for tasks operating on uploaded files. */
export interface QueueMessageMediaUpload {
  /** S3 object key in the uploads bucket. Has to be an encrypted `UploadToken`. */
  key: string;
}

export type QueueMessageIdentify = QueueMessageMediaUpload;

export interface QueueMessageMediaProcess extends QueueMessageMediaUpload {
  /** Encrypted video id */
  videoId: string;
}

export interface QueueMessageAdaptiveVideo extends QueueMessageMediaProcess {
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

    /** Output video codec. */
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

export interface QueueMessageAdaptiveAudio extends QueueMessageMediaProcess {
  /** Input audio specification. */
  input: {
    /** Input audio duration in seconds. */
    duration: number;
  };
}

export interface QueueMessageScrubberImage extends QueueMessageMediaProcess {
  /** Input audio specification. */
  input: {
    /** Input audio duration in seconds. */
    duration: number;

    /** Input video width. */
    width: number;

    /** Input video height. */
    height: number;
  };
}

export interface QueueMessages {
  [QueueTask.Identify]: QueueMessageIdentify;
  [QueueTask.AdaptiveVideo]: QueueMessageAdaptiveVideo;
  [QueueTask.AdaptiveAudio]: QueueMessageAdaptiveAudio;
  [QueueTask.ScrubberImage]: QueueMessageScrubberImage;
}
