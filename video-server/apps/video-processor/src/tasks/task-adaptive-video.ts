import fs from 'fs/promises';
import path from 'path';

import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

import { AuthConstants } from '@video/lib/auth';
import { FileUtils } from '@video/lib/utils';
import { QueueMessageAdaptiveVideo, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';
import { VideoStreamCreate, VideoUpdate } from '@video/lib/services';

import { HlsPlaylistEncoder, HlsSegmentEncoder, MediaEncoder, MediaEncoderVideoHlsOptions } from '../encoder';
import { MediaDecoder } from '../decoder';
import { Task } from './task';
import { VideoCodec } from '@video/lib/media';

@Injectable()
export class TaskAdaptiveVideo extends Task<QueueTask.AdaptiveVideo> {
  /** https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/codecs_parameter#avc_profiles */
  private readonly avcProfiles: Record<string, number> = {
    baseline: 0x42,
    main: 0x4d,
    high: 0x64,
  };

  public async run(message: QueueMessageAdaptiveVideo): Promise<void> {
    const shouldProcess = await this.redisService.get(`${QueueTask.AdaptiveVideo}:${message.videoId}:processing`);

    if (!shouldProcess) {
      this.logger.warn(`${message.videoId} - ${message.output.height}_${message.split.segmentStartIndex} skipping...`);
      return;
    }

    const input = await this.storageService.getDownloadUrl(StorageConstants.uploadsBucket, message.key);
    const output = path.join(
      '/tmp',
      message.videoId,
      `video_avc1_${message.output.height}_${message.split.segmentStartIndex}`,
    );

    const targetBitrate = Math.floor(
      message.output.width * message.output.height * message.output.bpp * message.output.fps,
    );

    const options: MediaEncoderVideoHlsOptions = {
      bitrate: {
        average: targetBitrate,
        bufferSize: targetBitrate * 2,
      },
      codec: message.output.codec.name,
      startTime: message.split.from.toString(10),
      duration: message.split.duration?.toString(10),
      fps: message.output.fps,
      groupOfPicturesSize: message.output.fps * 2,
      height: message.output.height,
      input,
      minimumKeyframeInterval: message.output.fps * 2,
      output,
      segmentDuration: StorageConstants.hlsSegmentDuration,
      width: message.output.width,
      level: message.output.codec.level,
      profile: message.output.codec.profile,
    };

    await new MediaEncoder().encodeVideoHls(options);

    const initFilepath = path.join(output, StorageConstants.hlsInit);
    const initMeta = await new MediaDecoder().probe(initFilepath);
    const timeBaseString = initMeta.streams[0]?.time_base ?? '';
    const timeBase = parseInt(timeBaseString.split('/')[1] ?? '0');

    const files = await FileUtils.listFiles(output);
    const streamName = `avc1_${message.output.height}p${message.output.fps}`;
    const mediaBucketPath = path.join(message.videoId, 'video', streamName);

    let totalSize = 0;

    for (const file of files) {
      const filepath = path.join(output, file.name);
      const segmentIndex = this.extractSegmentIndex(file.name);
      if (segmentIndex === null) continue; // Not a segment file

      const adjustedSegmentIndex = segmentIndex + message.split.segmentStartIndex;
      const adjustedSequenceNumber = adjustedSegmentIndex + 1;
      const segmentStartTimeSeconds = adjustedSegmentIndex * StorageConstants.hlsSegmentDuration;
      HlsSegmentEncoder.rebaseSegment(filepath, adjustedSequenceNumber, segmentStartTimeSeconds * timeBase);

      const adjustedSegmentName = `segment_${adjustedSegmentIndex.toString(10).padStart(6, '0')}.m4s`;

      await this.storageService.uploadLocalFile(
        StorageConstants.mediaBucket,
        path.join(mediaBucketPath, adjustedSegmentName),
        path.join(output, file.name),
      );

      const sizesKey = `${QueueTask.AdaptiveVideo}:${message.videoId}:split:${message.output.height}:segment_sizes`;
      await this.redisService.zadd(sizesKey, file.size, adjustedSegmentIndex);

      totalSize += file.size;
    }

    const sizeKey = `${QueueTask.AdaptiveVideo}:${message.videoId}:split:${message.output.height}:byte_size`;
    const formatSize = await this.redisService.incrby(sizeKey, totalSize);

    if (message.split.segmentStartIndex === 0) {
      await this.storageService.uploadLocalFile(
        StorageConstants.mediaBucket,
        path.join(mediaBucketPath, StorageConstants.hlsInit),
        path.join(output, StorageConstants.hlsInit),
      );

      await this.storageService.upload(
        StorageConstants.mediaBucket,
        path.join(mediaBucketPath, StorageConstants.hlsStreamPlaylist),
        HlsPlaylistEncoder.encode(message.input.duration),
      );
    }

    await fs.rm(output, { recursive: true, force: true });

    const remainingSectionsKey = `${QueueTask.AdaptiveVideo}:${message.videoId}:split:${message.output.height}:remaining`;
    const remainingSections = await this.redisService.decr(remainingSectionsKey);

    if (remainingSections !== 0) {
      this.logger.log(`${message.videoId} ${message.output.height}: ${remainingSections} sections remaining.`);
      return;
    }

    this.logger.log(`${message.videoId} ${message.output.height}: format completed.`);

    const averageBitrate = Math.floor(message.input.duration ? (formatSize * 8) / message.input.duration : 0);
    const sizesKey = `${QueueTask.AdaptiveVideo}:${message.videoId}:split:${message.output.height}:segment_sizes`;
    const peakSegment = await this.redisService.zrevrange(sizesKey, 0, 0, 'WITHSCORES');
    const peakSegmentSize = peakSegment[1] ? Number(peakSegment[1]) : 0;
    const peakBitrate = Math.floor((peakSegmentSize * 8) / StorageConstants.hlsSegmentDuration);

    await firstValueFrom(
      this.httpService.post<void, VideoStreamCreate>(
        `${this.config.video.apiUrlInternal}/v1/videos/${message.videoId}/streams/video`,
        {
          averageBitrate,
          size: formatSize,
          codecId: this.getCodecId(message.output.codec),
          codecName: `AVC ${message.output.codec.profile} profile ${message.output.codec.level} level`,
          framerate: message.output.fps,
          height: message.output.height,
          peakBitrate,
          stream: streamName,
          width: message.output.width,
        },
        {
          headers: {
            [AuthConstants.InternalHeader]: this.config.video.apiInternalKey,
          },
        },
      ),
    );

    const remainingFormatsKey = `${QueueTask.AdaptiveVideo}:${message.videoId}:formats:remaining`;
    const remainingFormats = await this.redisService.decr(remainingFormatsKey);

    if (remainingFormats !== 0) {
      this.logger.log(`${message.videoId}: ${remainingFormats} formats remaining.`);
      return;
    }

    this.logger.log(`${message.videoId}: all formats completed.`);

    await firstValueFrom(
      this.httpService.patch<void, VideoUpdate>(
        `${this.config.video.apiUrlInternal}/v1/videos/${message.videoId}`,
        {
          status: 'successful',
        },
        {
          headers: {
            [AuthConstants.InternalHeader]: this.config.video.apiInternalKey,
          },
        },
      ),
    );

    await this.redisService.del(`${QueueTask.AdaptiveVideo}:${message.videoId}:*`);
  }

  private extractSegmentIndex(filename: string): number | null {
    const match = filename.match(StorageConstants.hlsSegmentRegex);
    if (!match?.[1]) return null;
    const index = parseInt(match[1], 10);
    return isNaN(index) ? null : index;
  }

  private getCodecId(codec: VideoCodec): string {
    const profile = this.avcProfiles[codec.profile] ?? this.avcProfiles.main;
    return `avc1.${profile?.toString(16)}00${codec.level.replace('.', '')}`;
  }
}
