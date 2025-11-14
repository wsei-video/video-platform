import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

import { QueueExchange, QueueMessages, QueueTask } from './queue.types';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  public constructor(private readonly connection: AmqpConnection) {}

  public async publish<TTask extends QueueTask>(task: TTask, message?: QueueMessages[TTask]): Promise<void> {
    this.logger.log(`Publishing task '${task}'`, message);
    await this.connection.publish(QueueExchange.Media, task, message);
  }
}
