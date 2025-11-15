import path from 'path';

import { Injectable } from '@nestjs/common';

import { FileUtils } from '@video/lib/utils';
import { QueueMessageAdaptiveVideo, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';

import { HlsPlaylistEncoder, HlsSegmentEncoder, MediaEncoder, MediaEncoderVideoHlsOptions } from '../encoder';
import { MediaDecoder } from '../decoder';
import { Task } from './task';

@Injectable()
export class TaskAdaptiveVideo extends Task<QueueTask.AdaptiveVideo> {
  public async run(message: QueueMessageAdaptiveVideo): Promise<void> {
    const input = await this.storageService.getDownloadUrl(StorageConstants.uploadsBucket, message.key);
    const output = path.join(
      '/tmp',
      message.key,
      `video_avc1_${message.output.height}_${message.split.segmentStartIndex}`,
    );

    const options: MediaEncoderVideoHlsOptions = {
      bitrate: {
        average: 800,
        maximum: 856,
        bufferSize: 1200,
      },
      codec: 'libx264',
      startTime: message.split.from.toString(10),
      duration: message.split.duration?.toString(10),
      fps: message.output.fps,
      groupOfPicturesSize: message.output.fps * 2,
      height: message.output.height,
      input,
      minimumKeyframeInterval: message.output.fps * 2,
      output,
      sceneChangeThreshold: 0,
      segmentDuration: StorageConstants.hlsSegmentDuration,
      width: message.output.width,
    };

    await new MediaEncoder().encodeVideoHls(options);

    const initFilepath = path.join(output, StorageConstants.hlsInit);
    const initMeta = await new MediaDecoder().probe(initFilepath);
    const timeBaseString = initMeta.streams[0]?.time_base ?? '';
    const timeBase = parseInt(timeBaseString.split('/')[1] ?? '0');

    const files = await FileUtils.listFiles(output);
    const mediaBucketPath = path.join(message.key, 'video', 'avc1', `${message.output.height}p`);

    for (const filename of files) {
      const filepath = path.join(output, filename);
      const segmentIndex = this.extractSegmentIndex(filename);
      if (segmentIndex === null) continue; // Not a segment file

      const adjustedSegmentIndex = segmentIndex + message.split.segmentStartIndex;
      const segmentStartTimeSeconds = adjustedSegmentIndex * StorageConstants.hlsSegmentDuration;
      HlsSegmentEncoder.rebaseSegment(filepath, adjustedSegmentIndex, segmentStartTimeSeconds * timeBase);

      const adjustedSegmentName = `segment_${adjustedSegmentIndex.toString(10).padStart(3, '0')}.m4s`;

      await this.storageService.uploadLocalFile(
        StorageConstants.mediaBucket,
        path.join(mediaBucketPath, adjustedSegmentName),
        path.join(output, filename),
      );
    }

    if (message.split.segmentStartIndex !== 0) return;

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

  private extractSegmentIndex(filename: string): number | null {
    const match = filename.match(StorageConstants.hlsSegmentRegex);
    if (!match?.[1]) return null;
    const index = parseInt(match[1], 10);
    return isNaN(index) ? null : index;
  }
}
