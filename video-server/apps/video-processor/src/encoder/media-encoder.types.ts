export interface MediaEncoderInputOutputOptions {
  input: string;
  output: string;
}

export interface MediaEncoderHlsOptions extends MediaEncoderInputOutputOptions {
  codec: string;
  segmentDuration: number;
}

export interface MediaEncoderVideoHlsOptions extends MediaEncoderHlsOptions {
  bitrate: {
    average: number;
    bufferSize: number;
  };
  width: number;
  height: number;
  groupOfPicturesSize: number;
  minimumKeyframeInterval: number;
  fps: number;
  startTime: string;
  duration?: string;
  profile: string;
  level: string;
}

export interface MediaEncoderAudioHlsOptions extends MediaEncoderHlsOptions {
  bitrate: number;
}

export interface MediaEncoderScrubberImageOptions extends MediaEncoderInputOutputOptions {
  columns: number;
  rows: number;
  width: number;
  height: number;
  frameDuration: number;
}
