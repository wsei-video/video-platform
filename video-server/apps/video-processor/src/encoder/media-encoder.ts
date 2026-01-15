import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

import { Logger } from '@nestjs/common';

import { StorageConstants } from '@video/lib/storage';

import {
  MediaEncoderAudioHlsOptions,
  MediaEncoderHlsOptions,
  MediaEncoderInputOutputOptions,
  MediaEncoderScrubberImageOptions,
  MediaEncoderThumbnailOptions,
  MediaEncoderThumbnailVariant,
  MediaEncoderVideoHlsOptions,
} from './media-encoder.types';

const execFileAsync = promisify(execFile);

export class MediaEncoder {
  private readonly logger = new Logger(MediaEncoder.name);

  public async encodeVideoHls(options: MediaEncoderVideoHlsOptions): Promise<void> {
    const args: string[] = [
      ...this.getInputArguments(options),
      '-ss',
      options.startTime,
      ...(options.duration !== undefined ? ['-t', options.duration] : []),
      '-an',
      '-sn',
      '-map_metadata',
      '-1',
      '-map_chapters',
      '-1',
      '-max_muxing_queue_size',
      '10000',
      '-max_interleave_delta',
      '100M',
      '-threads',
      '6',
      '-c:v',
      options.codec,
      '-x264opts',
      'no-scenecut',
      '-profile:v',
      options.profile,
      '-level',
      options.level,
      '-vf',
      `yadif=0:-1:1,fps=${options.fps},scale=${options.width}:${options.height},setsar=`,
      '-preset',
      'medium',
      '-crf',
      '23',
      '-pix_fmt',
      'yuv420p',
      '-b:v',
      `${options.bitrate.average}`,
      '-bufsize',
      `${options.bitrate.bufferSize}`,
      '-g',
      options.groupOfPicturesSize.toString(10),
      '-keyint_min',
      options.minimumKeyframeInterval.toString(10),
      ...this.getHlsArguments(options),
    ];

    await fs.mkdir(options.output, { recursive: true });
    this.logger.log(`Executing: ffmpeg ${args.join(' ')}`);
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
      '-ar',
      '44100',
      '-ac',
      '2',
      '-profile:a',
      'aac_low',
      ...this.getHlsArguments(options),
    ];

    await fs.mkdir(options.output, { recursive: true });
    this.logger.log(`Executing: ffmpeg ${args.join(' ')}`);
    await execFileAsync('ffmpeg', args);
  }

  public async encodeThumbnail(options: MediaEncoderThumbnailOptions): Promise<void> {
    const variantInputLabel = (variant: MediaEncoderThumbnailVariant) => `[v${variant.height}]`;
    const variantOutputLabel = (variant: MediaEncoderThumbnailVariant) => `[v${variant.height}o]`;

    const variantInputLabels = options.variants.map(variant => variantInputLabel(variant)).join('');

    const variantFilters = options.variants
      .map(variant => {
        const input = variantInputLabel(variant);
        const output = variantOutputLabel(variant);
        const scale = `scale=${variant.width}:${variant.height}`;
        return `${input}${scale}${output}`;
      })
      .join('; ');

    const variantMappings = options.variants
      .map(variant => {
        const output = variantOutputLabel(variant);
        return ['-map', output, `${options.output}/thumbnail_%01d_${variant.height}p.jpg`];
      })
      .flat();

    const args: string[] = [
      ...this.getInputArguments(options),
      '-an',
      '-filter_complex',
      `fps=${options.fps},split=${options.variants.length}${variantInputLabels}; ${variantFilters}`,
      ...variantMappings,
    ];

    await fs.mkdir(options.output, { recursive: true });
    this.logger.log(`Executing: ffmpeg ${args.join(' ')}`);
    await execFileAsync('ffmpeg', args);
  }

  public async encodeScrubberImage(options: MediaEncoderScrubberImageOptions): Promise<void> {
    const args: string[] = [
      ...this.getInputArguments(options),
      '-an',
      '-filter_complex',
      `fps=1/${options.frameDuration}:round=down,scale=${options.width}x${options.height},tile=${options.columns}x${options.rows}`,
      '-qscale:v',
      '12',
      `${options.output}/scrubber_%06d.jpg`,
    ];

    await fs.mkdir(options.output, { recursive: true });
    this.logger.log(`Executing: ffmpeg ${args.join(' ')}`);
    await execFileAsync('ffmpeg', args);
  }

  private getInputArguments(options: MediaEncoderInputOutputOptions): string[] {
    return [
      '-abort_on',
      'empty_output',
      '-y',
      '-nostats',
      '-hide_banner',
      '-progress',
      'pipe:1',
      '-filter_complex_threads',
      '4',
      '-analyzeduration',
      '20M',
      '-threads',
      '4',
      '-reconnect',
      '1',
      '-rw_timeout',
      '15M',
      '-multiple_requests',
      '1',
      '-reconnect_on_http_error',
      '5xx',
      '-reconnect_on_network_error',
      '1',
      '-reconnect_delay_max',
      '120',
      '-i',
      options.input,
    ];
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
      `${options.output}/segment_%06d.m4s`,
      `${options.output}/${StorageConstants.hlsStreamPlaylist}`,
    ];
  }
}
