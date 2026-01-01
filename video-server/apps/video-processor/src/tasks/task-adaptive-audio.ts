import fs from 'fs/promises';
import path from 'path';

import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

import { AudioStreamCreate } from '@video/lib/services';
import { AuthConstants } from '@video/lib/auth';
import { FileUtils } from '@video/lib/utils';
import { QueueMessageAdaptiveAudio, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';

import { MediaEncoder, MediaEncoderAudioHlsOptions } from '../encoder';
import { Task } from './task';

@Injectable()
export class TaskAdaptiveAudio extends Task<QueueTask.AdaptiveAudio> {
  public async run(message: QueueMessageAdaptiveAudio): Promise<void> {
    const input = await this.storageService.getDownloadUrl(StorageConstants.uploadsBucket, message.key);
    const output = path.join('/tmp', message.videoId, 'audio_aac');

    const options: MediaEncoderAudioHlsOptions = {
      bitrate: 256,
      codec: 'aac',
      input,
      output,
      segmentDuration: StorageConstants.hlsSegmentDuration,
    };

    await new MediaEncoder().encodeAudioHls(options);

    const streamName = 'aac';
    const files = await FileUtils.listFiles(output);

    let totalSize = 0;

    for (const file of files) {
      await this.storageService.uploadLocalFile(
        StorageConstants.mediaBucket,
        path.join(message.videoId, 'audio', streamName, file.name),
        path.join(output, file.name),
      );

      totalSize += file.size;
    }

    await fs.rm(output, { recursive: true, force: true });

    await firstValueFrom(
      this.httpService.post<void, AudioStreamCreate>(
        `${this.config.video.apiUrlInternal}/v1/videos/${message.videoId}/streams/audio`,
        {
          size: totalSize,
          channels: 2,
          codecId: 'mp4a.40.2',
          codecName: 'AAC Low Complexity',
          stream: streamName,
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
