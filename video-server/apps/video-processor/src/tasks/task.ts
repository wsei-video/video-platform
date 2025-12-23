import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { Config } from '@video/lib/config';
import { QueueMessages, QueueService, QueueTask } from '@video/lib/queue';
import { StorageService } from '@video/lib/storage';

/** Video Processor base task. */
@Injectable()
export abstract class Task<TQueueTask extends QueueTask> {
  protected readonly logger = new Logger(this.constructor.name);

  public constructor(
    protected readonly config: Config,
    protected readonly httpService: HttpService,
    protected readonly queueService: QueueService,
    protected readonly storageService: StorageService,
  ) {}

  public abstract run(message: QueueMessages[TQueueTask]): Promise<void>;
}
