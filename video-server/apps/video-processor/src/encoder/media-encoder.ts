import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

import { StorageConstants } from '@video/lib/storage';

import {
  MediaEncoderAudioHlsOptions,
  MediaEncoderHlsOptions,
  MediaEncoderVideoHlsOptions,
} from './media-encoder.types';

const execFileAsync = promisify(execFile);

export class MediaEncoder {
  public async encodeVideoHls(options: MediaEncoderVideoHlsOptions): Promise<void> {
    const args: string[] = [
      ...this.getInputArguments(options),
      '-ss',
      options.startTime,
      ...(options.duration !== undefined ? ['-t', options.duration] : []),
      '-an',
      '-c:v',
      options.codec,
      '-r',
      options.fps.toString(10),
      '-vf',
      `scale=${options.width}:${options.height}`,
      '-preset',
      'medium',
      '-crf',
      '23',
      '-b:v',
      `${options.bitrate.average}k`,
      '-maxrate',
      `${options.bitrate.maximum}k`,
      '-bufsize',
      `${options.bitrate.bufferSize}k`,
      '-g',
      options.groupOfPicturesSize.toString(10),
      '-keyint_min',
      options.minimumKeyframeInterval.toString(10),
      '-sc_threshold',
      options.sceneChangeThreshold.toString(10),
      ...this.getHlsArguments(options),
    ];

    await fs.mkdir(options.output, { recursive: true });
    await execFileAsync('ffmpeg', args);
  }

  public async encodeAudioHls(options: MediaEncoderAudioHlsOptions): Promise<void> {
    const args: string[] = [
      ...this.getInputArguments(options),
      '-vn',
      '-c:a',
      options.codec,
      '-b:a',
      `${options.bitrate}k`,
      '-ac',
      '2',
      ...this.getHlsArguments(options),
    ];

    await fs.mkdir(options.output, { recursive: true });
    await execFileAsync('ffmpeg', args);
  }

  private getInputArguments(options: MediaEncoderHlsOptions): string[] {
    return ['-i', options.input, '-threads', '4', '-avoid_negative_ts', 'make_zero'];
  }

  private getHlsArguments(options: MediaEncoderHlsOptions): string[] {
    return [
      '-f',
      'hls',
      '-hls_time',
      options.segmentDuration.toString(10),
      '-hls_playlist_type',
      'vod',
      '-hls_segment_type',
      'fmp4',
      '-hls_fmp4_init_filename',
      StorageConstants.hlsInit,
      '-hls_segment_filename',
      `${options.output}/segment_%03d.m4s`,
      `${options.output}/${StorageConstants.hlsStreamPlaylist}`,
    ];
  }
}
