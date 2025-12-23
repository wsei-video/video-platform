import path from 'path';

import { Injectable } from '@nestjs/common';

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
      bitrate: 128,
      codec: 'aac',
      input,
      output,
      segmentDuration: StorageConstants.hlsSegmentDuration,
    };

    await new MediaEncoder().encodeAudioHls(options);

    const files = await FileUtils.listFiles(output);

    for (const fileName of files) {
      await this.storageService.uploadLocalFile(
        StorageConstants.mediaBucket,
        path.join(message.videoId, 'audio', 'aac', fileName),
        path.join(output, fileName),
      );
    }
  }
}
