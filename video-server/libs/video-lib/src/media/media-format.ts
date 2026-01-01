export interface VideoResolution {
  /** Maximum video width for the format. */
  width: number;
  /** Maximum video height for the format. */
  height: number;
}

export interface VideoCodec {
  /** Libav codec name. */
  name: string;

  /** Codec profile. */
  profile: string;

  /** Target decoder compatibility level. */
  level: string;
}

export interface VideoFormat {
  /** Max video resolution. */
  resolution: VideoResolution;

  /** Video bitrate information. */
  bitrate: {
    /** Bits per pixel for average bitrate if encoded with H.264 (AVC). */
    bpp: number;
  };

  /** Maximum fps used when encoding format. */
  fpsCap: number;

  /** Video codec information. */
  codec: VideoCodec;
}

export enum VideoCoding {
  Avc = 'AVC',
  Vp9 = 'VP9',
}

export const VideoCodingSpec: Record<VideoCoding, { bitrate: { efficiency: number } }> = {
  [VideoCoding.Avc]: { bitrate: { efficiency: 1 } },
  [VideoCoding.Vp9]: { bitrate: { efficiency: 0.8 } },
};

export const SUPPORTED_VIDEO_FORMATS: VideoFormat[] = [
  {
    resolution: {
      width: 256,
      height: 144,
    },
    bitrate: {
      bpp: 0.17,
    },
    fpsCap: 30,
    codec: {
      name: 'libx264',
      profile: 'main',
      level: '3.0',
    },
  },
  {
    resolution: {
      width: 426,
      height: 240,
    },
    bitrate: {
      bpp: 0.16,
    },
    fpsCap: 30,
    codec: {
      name: 'libx264',
      profile: 'main',
      level: '3.0',
    },
  },
  {
    resolution: {
      width: 640,
      height: 360,
    },
    bitrate: {
      bpp: 0.15,
    },
    fpsCap: 30,
    codec: {
      name: 'libx264',
      profile: 'main',
      level: '3.0',
    },
  },
  {
    resolution: {
      width: 854,
      height: 480,
    },
    bitrate: {
      bpp: 0.12,
    },
    fpsCap: 60,
    codec: {
      name: 'libx264',
      profile: 'main',
      level: '3.1',
    },
  },
  {
    resolution: {
      width: 1280,
      height: 720,
    },
    bitrate: {
      bpp: 0.11,
    },
    fpsCap: 60,
    codec: {
      name: 'libx264',
      profile: 'high',
      level: '4.0',
    },
  },
  {
    resolution: {
      width: 1920,
      height: 1080,
    },
    bitrate: {
      bpp: 0.1,
    },
    fpsCap: 60,
    codec: {
      name: 'libx264',
      profile: 'high',
      level: '4.2',
    },
  },
  {
    resolution: {
      width: 2560,
      height: 1440,
    },
    bitrate: {
      bpp: 0.09,
    },
    fpsCap: 60,
    codec: {
      name: 'libx264',
      profile: 'high',
      level: '5.1',
    },
  },
  {
    resolution: {
      width: 3840,
      height: 2160,
    },
    bitrate: {
      bpp: 0.08,
    },
    fpsCap: 60,
    codec: {
      name: 'libx264',
      profile: 'high',
      level: '5.2',
    },
  },
  {
    resolution: {
      width: 7680,
      height: 4320,
    },
    bitrate: {
      bpp: 0.06,
    },
    fpsCap: 60,
    codec: {
      name: 'libx264',
      profile: 'high',
      level: '6.0',
    },
  },
];
