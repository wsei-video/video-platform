import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import { AuthConstants } from '@video/lib/auth';
import { Config } from '@video/lib/config';
import { GoneError, UnauthorizedError } from '@video/lib/restful';
import { QueueService, QueueTask } from '@video/lib/queue';
import { UploadToken } from '@video/lib/token';
import { VideoSourceUpdate } from '@video/lib/services';

@Injectable()
export class UploadService {
  @Inject(Config) protected readonly config: Config;
  @Inject(HttpService) protected readonly httpService: HttpService;
  @Inject(QueueService) protected readonly queueService: QueueService;

  protected verifyToken(token: string): UploadToken {
    const uploadToken = UploadToken.decrypt(token);
    if (!uploadToken) throw new UnauthorizedError();
    if (uploadToken.hasExpired()) throw new GoneError();
    return uploadToken;
  }

  protected async completeUpload(upload: CompletedUpload): Promise<void> {
    await this.updateVideoSource(upload);
    await this.publish(upload.key);
  }

  private async updateVideoSource(upload: CompletedUpload): Promise<void> {
    const uploadToken = UploadToken.decrypt(upload.key);
    if (!uploadToken) return;

    await firstValueFrom(
      this.httpService.patch<void, VideoSourceUpdate>(
        `${this.config.video.apiUrlInternal}/v1/videos/${uploadToken.videoId.encrypted}/source`,
        {
          name: upload.originalFileName,
          size: upload.originalFileSize,
          userId: uploadToken.accountId.encrypted,
          key: upload.key,
        },
        {
          headers: {
            [AuthConstants.InternalHeader]: this.config.video.apiInternalKey,
          },
        },
      ),
    );
  }

  /** Enqueues file identification task after upload. */
  private async publish(key: string): Promise<void> {
    await this.queueService.publish(QueueTask.Identify, { key });
  }
}

export interface CompletedUpload {
  originalFileName: string;
  originalFileSize: number;
  key: string;
}
