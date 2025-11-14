export interface VideoFormat {
  resolution: {
    /** Maximum video width for the format. */
    width: number;
    /** Maximum video height for the format. */
    height: number;
  };
  bitrate: {
    /** Bits per pixel for average bitrate if encoded with H.264 (AVC). */
    bpp: number;
  };
  /** Maximum fps used when encoding format. */
  fpsCap: number;
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
      width: 640,
      height: 360,
    },
    bitrate: {
      bpp: 0.15,
    },
    fpsCap: 30,
  },
  {
    resolution: {
      width: 854,
      height: 480,
    },
    bitrate: {
      bpp: 0.12,
    },
    fpsCap: 30,
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
  },
];
