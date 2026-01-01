import { beforeEach, describe, expect, test } from 'vitest';

import { MediaProbe } from '../decoder';
import { IdentifyService } from './identify.service';

describe('IdentifyService', () => {
  let identifyService: IdentifyService;

  beforeEach(() => {
    identifyService = new IdentifyService();
  });

  test('No streams', () => {
    const meta: MediaProbe = {
      streams: [],
      format: {
        nb_streams: 0,
        format_name: 'mp3',
        format_long_name: 'MP2/3 (MPEG audio layer 2/3)',
        start_time: '0.025057',
        duration: '7.449002',
        size: '120206',
        bit_rate: '129097',
      },
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: {
        duration: 0,
        included: false,
      },
      video: {
        formatHeights: [],
        sectionCount: 0,
        tasks: [],
      },
    });
  });

  test('Audio only', () => {
    const meta: MediaProbe = {
      streams: [
        {
          index: 0,
          codec_name: 'mp3',
          codec_long_name: 'MP3 (MPEG audio layer 3)',
          codec_type: 'audio',
          channels: 2,
          channel_layout: 'stereo',
          r_frame_rate: '0/0',
          avg_frame_rate: '0/0',
          time_base: '1/14112000',
          start_pts: 353600,
          start_time: '0.025057',
          duration: '7.449002',
          bit_rate: '128000',
        },
      ],
      format: {
        nb_streams: 1,
        format_name: 'mp3',
        format_long_name: 'MP2/3 (MPEG audio layer 2/3)',
        start_time: '0.025057',
        duration: '7.449002',
        size: '120206',
        bit_rate: '129097',
      },
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: {
        duration: 7.449002,
        included: true,
      },
      video: {
        formatHeights: [],
        sectionCount: 0,
        tasks: [],
      },
    });
  });

  test('256x144@60 3s (landscape)', () => {
    const meta: MediaProbe = {
      streams: [
        {
          index: 0,
          codec_type: 'video',
          width: 256,
          height: 144,
          r_frame_rate: '60/1',
          duration: '3.000000',
        },
      ],
      format: {},
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: {
        duration: 0,
        included: false,
      },
      video: {
        formatHeights: [144],
        sectionCount: 1,
        tasks: [
          {
            input: {
              duration: 3,
            },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              fps: 30, // should cap to 30 fps for low res
              height: 144,
              width: 256,
            },
            split: {
              duration: null, // should transcode till the end
              from: 0,
              segmentStartIndex: 0,
            },
          },
        ],
      },
    });
  });

  test('144x144@25 3s (square)', () => {
    const meta: MediaProbe = {
      streams: [
        {
          index: 0,
          codec_type: 'video',
          width: 144,
          height: 144,
          r_frame_rate: '25/1',
          duration: '3.000000',
        },
      ],
      format: {},
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: { duration: 0, included: false },
      video: {
        formatHeights: [144],
        sectionCount: 1,
        tasks: [
          {
            input: {
              duration: 3,
            },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              fps: 25,
              height: 144,
              width: 144,
            },
            split: {
              duration: null,
              from: 0,
              segmentStartIndex: 0,
            },
          },
        ],
      },
    });
  });

  test('144x256@100 6s (portrait)', () => {
    const meta: MediaProbe = {
      streams: [
        {
          index: 0,
          codec_type: 'video',
          width: 144,
          height: 256,
          r_frame_rate: '100/1',
          duration: '6.000000',
        },
      ],
      format: {},
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: { duration: 0, included: false },
      video: {
        formatHeights: [256],
        sectionCount: 1,
        tasks: [
          {
            input: {
              duration: 6,
            },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              fps: 25,
              height: 256,
              width: 144,
            },
            split: {
              duration: null,
              from: 0,
              segmentStartIndex: 0,
            },
          },
        ],
      },
    });
  });

  test('640x240@60 6s (landscape wide)', () => {
    const meta: MediaProbe = {
      streams: [
        {
          index: 0,
          codec_type: 'video',
          width: 640,
          height: 240,
          r_frame_rate: '60/1',
          duration: '6.000000',
        },
      ],
      format: {},
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: {
        duration: 0,
        included: false,
      },
      video: {
        formatHeights: [144, 240],
        sectionCount: 1,
        tasks: [
          {
            input: { duration: 6 },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 384,
              height: 144,
              fps: 30,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 6 },
            output: {
              bpp: 0.16,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 640,
              height: 240,
              fps: 30,
            }, // allow this format even though the width exceeds max
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
        ],
      },
    });
  });

  test('Multiple split and stitch sections - 256x144@60 60s (landscape)', () => {
    const meta: MediaProbe = {
      streams: [
        {
          index: 0,
          codec_type: 'video',
          width: 256,
          height: 144,
          r_frame_rate: '60/1',
          duration: '60.000000',
        },
      ],
      format: {},
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: {
        duration: 0,
        included: false,
      },
      video: {
        formatHeights: [144],
        sectionCount: 4,
        tasks: [
          {
            input: { duration: 60 },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 256,
              height: 144,
              fps: 30,
            },
            split: { duration: 18, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 60 },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 256,
              height: 144,
              fps: 30,
            },
            split: { duration: 18, segmentStartIndex: 3, from: 18 },
          },
          {
            input: { duration: 60 },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 256,
              height: 144,
              fps: 30,
            },
            split: { duration: 18, segmentStartIndex: 6, from: 36 },
          },
          {
            input: { duration: 60 },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 256,
              height: 144,
              fps: 30,
            },
            split: { duration: null, segmentStartIndex: 9, from: 54 },
          },
        ],
      },
    });
  });

  test('Multiple formats scheduled 3840x2160@120 18s (4K landscape)', () => {
    const meta: MediaProbe = {
      streams: [
        {
          index: 0,
          codec_type: 'video',
          width: 3840,
          height: 2160,
          r_frame_rate: '120/1',
          duration: '18.000000',
        },
      ],
      format: {},
    };

    const specification = identifyService.identify(meta);

    expect(specification).toEqual({
      audio: {
        duration: 0,
        included: false,
      },
      video: {
        formatHeights: [144, 240, 360, 480, 720, 1080, 1440, 2160],
        sectionCount: 1,
        tasks: [
          {
            input: { duration: 18 },
            output: {
              bpp: 0.17,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 256,
              height: 144,
              fps: 30,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 18 },
            output: {
              bpp: 0.16,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 426,
              height: 240,
              fps: 30,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 18 },
            output: {
              bpp: 0.15,
              codec: {
                level: '3.0',
                name: 'libx264',
                profile: 'main',
              },
              width: 640,
              height: 360,
              fps: 30,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 18 },
            output: {
              bpp: 0.12,
              codec: {
                level: '3.1',
                name: 'libx264',
                profile: 'main',
              },
              width: 854,
              height: 480,
              fps: 60,
            }, // cap to 60fps - max allowed by the platform
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 18 },
            output: {
              bpp: 0.11,
              codec: {
                level: '4.0',
                name: 'libx264',
                profile: 'high',
              },
              width: 1280,
              height: 720,
              fps: 60,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 18 },
            output: {
              bpp: 0.1,
              codec: {
                level: '4.2',
                name: 'libx264',
                profile: 'high',
              },
              width: 1920,
              height: 1080,
              fps: 60,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 18 },
            output: {
              bpp: 0.09,
              codec: {
                level: '5.1',
                name: 'libx264',
                profile: 'high',
              },
              width: 2560,
              height: 1440,
              fps: 60,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
          {
            input: { duration: 18 },
            output: {
              bpp: 0.08,
              codec: {
                level: '5.2',
                name: 'libx264',
                profile: 'high',
              },
              width: 3840,
              height: 2160,
              fps: 60,
            },
            split: { duration: null, segmentStartIndex: 0, from: 0 },
          },
        ],
      },
    });
  });
});
