import path from 'node:path';
import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

import { QueueMessageScrubberImage, QueueTask } from '@video/lib/queue';
import { FileUtils } from '@video/lib/utils';
import { StorageConstants } from '@video/lib/storage';

import { Task } from './task';
import { MediaEncoder, MediaEncoderScrubberImageOptions } from '../encoder';
import { firstValueFrom } from 'rxjs';
import { VideoScrubberImageCreate } from '@video/lib/services';
import { AuthConstants } from '@video/lib/auth';

@Injectable()
export class TaskScrubberImage extends Task<QueueTask.ScrubberImage> {
  public async run(message: QueueMessageScrubberImage): Promise<void> {
    const input = await this.storageService.getDownloadUrl(StorageConstants.uploadsBucket, message.key);
    const output = path.join('/tmp', message.videoId, 'image_scrubber');

    const columns = 8;
    const rows = 4;
    const height = 135;
    const frameDuration = 2;
    const aspect = message.input.width / message.input.height;
    const width = Math.round(height * aspect);

    const options: MediaEncoderScrubberImageOptions = {
      input,
      output,
      width,
      height,
      columns,
      rows,
      frameDuration,
    };

    await new MediaEncoder().encodeScrubberImage(options);

    const files = await FileUtils.listFiles(output);
    const scrubberCount = files.length;

    for (const file of files) {
      await this.storageService.uploadLocalFile(
        StorageConstants.mediaBucket,
        path.join(message.videoId, 'image', 'scrubber', file.name),
        path.join(output, file.name),
      );
    }

    await fs.rm(output, { recursive: true, force: true });

    await firstValueFrom(
      this.httpService.post<void, VideoScrubberImageCreate>(
        `${this.config.video.apiUrlInternal}/v1/videos/${message.videoId}/streams/scrubber`,
        {
          columns,
          count: scrubberCount,
          frameDuration,
          height,
          rows,
          width,
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
