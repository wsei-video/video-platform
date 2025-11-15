import { Injectable } from '@nestjs/common';

import { QueueService, QueueTask } from '@video/lib/queue';

@Injectable()
export class UploadPublishService {
  public constructor(private readonly queueService: QueueService) {}

  /** Enqueues file identification task after upload. */
  public async publish(key: string): Promise<void> {
    await this.queueService.publish(QueueTask.Identify, { key });
  }
}
