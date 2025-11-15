import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Module, OnApplicationBootstrap, Type } from '@nestjs/common';

import { ConfigModule } from '@video/lib/config';
import { QueueModule, QueueTask } from '@video/lib/queue';
import { StorageModule } from '@video/lib/storage';

import { ProcessorConsumer } from './processor.consumer';
import { Task } from './tasks/task';
import { TaskAdaptiveAudio } from './tasks/task-adaptive-audio';
import { TaskAdaptiveVideo } from './tasks/task-adaptive-video';
import { TaskIdentify } from './tasks/task-identify';

const tasks: Type<Task<QueueTask>>[] = [TaskIdentify, TaskAdaptiveAudio, TaskAdaptiveVideo];

@Module({
  imports: [ConfigModule, QueueModule, StorageModule],
  providers: [ProcessorConsumer, ...tasks],
})
export class ProcessorModule implements OnApplicationBootstrap {
  public constructor(private readonly ampq: AmqpConnection) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.configureQueueChannel();
  }

  /** Restricts the Video Processor to grab only one task at the time. */
  private async configureQueueChannel(): Promise<void> {
    // Value `true` in the second argument tells the channel to ignore the queue type
    // as by default the prefetch mechanism grabs one task per queue which results
    // in multiple tasks from different queues being grabbed by one worker.
    await this.ampq.channel.prefetch(1, true);
  }
}
