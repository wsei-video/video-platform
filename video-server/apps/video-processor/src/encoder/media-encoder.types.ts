export interface MediaEncoderHlsOptions {
  input: string;
  output: string;
  codec: string;
  segmentDuration: number;
}

export interface MediaEncoderVideoHlsOptions extends MediaEncoderHlsOptions {
  bitrate: {
    average: number;
    maximum: number;
    bufferSize: number;
  };
  width: number;
  height: number;
  groupOfPicturesSize: number;
  minimumKeyframeInterval: number;
  fps: number;
  sceneChangeThreshold: number;
  startTime: string;
  duration?: string;
}

export interface MediaEncoderAudioHlsOptions extends MediaEncoderHlsOptions {
  bitrate: number;
}
