import { Injectable } from '@nestjs/common';

import { QueueMessageIdentify, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';
import { UploadToken } from '@video/lib/token';

import { MediaDecoder } from '../decoder';
import { Task } from './task';

@Injectable()
export class TaskIdentify extends Task<QueueTask.Identify> {
  public async run(message: QueueMessageIdentify): Promise<void> {
    const uploadToken = UploadToken.decrypt(message.key);
    if (!uploadToken) return this.logger.error(`Invalid upload token: ${message.key}`);

    const inputUrl = await this.storageService.getDownloadUrl(StorageConstants.uploadsBucket, message.key);
    const meta = await new MediaDecoder().probe(inputUrl);

    const hasAudio = meta.streams.some(stream => stream.codec_type === 'audio');

    if (hasAudio)
      await this.queueService.publish(QueueTask.AdaptiveAudio, {
        key: message.key,
        videoId: uploadToken.videoId.encrypted,
      });
    else this.logger.log('Media does not contain audio stream');

    const videoStream = meta.streams.find(stream => stream.codec_type === 'video');
    if (!videoStream) return this.logger.log('Media does not contain video stream');

    const width = videoStream.width;
    const height = videoStream.height;
    const durationString = videoStream.duration;
    const frameRateString = videoStream.r_frame_rate;

    if (!width) return this.logger.error('Video stream has no width');
    if (!height) return this.logger.error('Video stream has no height');
    if (!durationString) return this.logger.error('Video stream has no duration');
    if (!frameRateString) return this.logger.error('Video stream has no frame rate');

    const duration = parseFloat(durationString);
    const frameRate = this.parseFractionString(frameRateString);

    this.logger.log(
      'Identified video stream:',
      `codec=${videoStream.codec_name} resolution=${width}x${height}@${frameRate} - ${duration}s`,
    );

    const segmentCount = Math.ceil(duration / StorageConstants.hlsSegmentDuration);
    const sectionCount = Math.ceil(segmentCount / StorageConstants.hlsSectionMaxSegments);

    for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex++) {
      const isLastSection = sectionIndex + 1 === sectionCount;

      await this.queueService.publish(QueueTask.AdaptiveVideo, {
        key: message.key,
        videoId: uploadToken.videoId.encrypted,
        input: {
          duration,
        },
        output: {
          fps: frameRate,
          width: 640,
          height: 360,
        },
        split: {
          duration: isLastSection ? null : StorageConstants.hlsSectionMaxDuration,
          segmentStartIndex: sectionIndex * StorageConstants.hlsSectionMaxSegments,
          from: StorageConstants.hlsSectionMaxDuration * sectionIndex,
        },
      });
    }
  }

  private parseFractionString(fraction: string): number {
    const [dividend = 0, divisor = 1] = fraction.split('/').map(value => parseFloat(value));
    return dividend / divisor;
  }
}
