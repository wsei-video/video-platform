import path from 'node:path';
import fs from 'node:fs/promises';

import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

import { AuthConstants } from '@video/lib/auth';
import { FileUtils } from '@video/lib/utils';
import { QueueMessageThumbnail, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';
import { SUPPORTED_VIDEO_FORMATS } from '@video/lib/media';
import { VideoThumbnailCreate } from '@video/lib/services';

import { Task } from './task';
import { MediaEncoder, MediaEncoderThumbnailOptions, MediaEncoderThumbnailVariant } from '../encoder';

@Injectable()
export class TaskThumbnail extends Task<QueueTask.Thumbnail> {
  public async run(message: QueueMessageThumbnail): Promise<void> {
    const input = await this.storageService.getDownloadUrl(StorageConstants.uploadsBucket, message.key);
    const output = path.join('/tmp', message.videoId, 'image_thumbnail');

    const thumbnailCount = 9;
    const aspectRatio = message.input.width / message.input.height;

    const variantHeights = SUPPORTED_VIDEO_FORMATS.filter(
      format => format.resolution.height <= message.input.height,
    ).map(format => format.resolution.height);

    const variants = variantHeights.map<MediaEncoderThumbnailVariant>(height => ({
      width: Math.floor(height * aspectRatio),
      height,
    }));

    const options: MediaEncoderThumbnailOptions = {
      input,
      output,
      fps: `${thumbnailCount}/${Math.ceil(message.input.duration)}`,
      variants,
    };

    await new MediaEncoder().encodeThumbnail(options);

    const files = await FileUtils.listFiles(output);

    for (const file of files) {
      await this.storageService.uploadLocalFile(
        StorageConstants.mediaBucket,
        path.join(message.videoId, 'image', 'thumbnail', file.name),
        path.join(output, file.name),
      );
    }

    await fs.rm(output, { recursive: true, force: true });

    for (let thumbnailIndex = 0; thumbnailIndex < thumbnailCount; thumbnailIndex++) {
      const thumbnailName = `thumbnail_${thumbnailIndex + 1}`;

      await firstValueFrom(
        this.httpService.post<void, VideoThumbnailCreate>(
          `${this.config.video.apiUrlInternal}/v1/videos/${message.videoId}/streams/thumbnail`,
          {
            name: thumbnailName,
            variants: variants.map(variant => `${variant.width}x${variant.height}`).join(','),
            select: thumbnailIndex === 4,
          },
          {
            headers: {
              [AuthConstants.InternalHeader]: this.config.video.apiInternalKey,
            },
          },
        ),
      );
    }
  }
}
