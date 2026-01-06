import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

import { AuthConstants } from '@video/lib/auth';
import { QueueMessageIdentify, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';
import { UploadToken } from '@video/lib/token';
import { VideoUpdate } from '@video/lib/services';

import { IdentifyService } from '../services/identify.service';
import { MediaDecoder } from '../decoder';
import { Task } from './task';

@Injectable()
export class TaskIdentify extends Task<QueueTask.Identify> {
  private readonly identifyService = new IdentifyService();

  public async run(message: QueueMessageIdentify): Promise<void> {
    const uploadToken = UploadToken.decrypt(message.key);
    if (!uploadToken) return this.logger.error(`Invalid upload token: ${message.key}`);

    const inputUrl = await this.storageService.getDownloadUrl(StorageConstants.uploadsBucket, message.key);
    const meta = await new MediaDecoder().probe(inputUrl);
    const specification = this.identifyService.identify(meta);

    await firstValueFrom(
      this.httpService.patch<void, VideoUpdate>(
        `${this.config.video.apiUrlInternal}/v1/videos/${uploadToken.videoId.encrypted}`,
        {
          duration: Math.round(parseFloat(meta.format.duration ?? '0')),
          status: 'processing',
        },
        {
          headers: {
            [AuthConstants.InternalHeader]: this.config.video.apiInternalKey,
          },
        },
      ),
    );

    if (specification.audio) {
      await this.queueService.publish(QueueTask.AdaptiveAudio, {
        key: message.key,
        videoId: uploadToken.videoId.encrypted,
        input: { duration: specification.audio.duration },
      });
    }

    const key = `${QueueTask.AdaptiveVideo}:${uploadToken.videoId.encrypted}`;
    await this.redisService.set(`${key}:processing`, 1);
    await this.redisService.set(`${key}:formats:remaining`, specification.video.formatHeights.length);

    await Promise.all(
      specification.video.formatHeights.map(height => {
        const key = `${QueueTask.AdaptiveVideo}:${uploadToken.videoId.encrypted}:split:${height}:remaining`;
        return this.redisService.set(key, specification.video.sectionCount);
      }),
    );

    if (specification.video.duration) {
      await this.queueService.publish(QueueTask.ScrubberImage, {
        key: message.key,
        videoId: uploadToken.videoId.encrypted,
        input: {
          duration: specification.video.duration,
          width: specification.video.width,
          height: specification.video.height,
        },
      });
    }

    await Promise.all(
      specification.video.tasks.map(task =>
        this.queueService.publish(QueueTask.AdaptiveVideo, {
          key: message.key,
          videoId: uploadToken.videoId.encrypted,
          ...task,
        }),
      ),
    );
  }
}
