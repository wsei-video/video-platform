import { Injectable, Logger } from '@nestjs/common';

import { QueueMessages, QueueService, QueueTask } from '@video/lib/queue';
import { StorageService } from '@video/lib/storage';

/** Video Processor base task. */
@Injectable()
export abstract class Task<TQueueTask extends QueueTask> {
  protected readonly logger = new Logger(this.constructor.name);

  public constructor(
    protected readonly storageService: StorageService,
    protected readonly queueService: QueueService,
  ) {}

  public abstract run(message: QueueMessages[TQueueTask]): Promise<void>;
}
