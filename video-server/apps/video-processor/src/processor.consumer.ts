import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { AuthConstants } from '@video/lib/auth';
import { Config } from '@video/lib/config';
import { QueueExchange, QueueMessages, QueueTask } from '@video/lib/queue';
import { RedisService } from '@video/lib/redis';
import { VideoUpdate } from '@video/lib/services';

import { Task } from './tasks/task';
import { TaskAdaptiveAudio } from './tasks/task-adaptive-audio';
import { TaskAdaptiveVideo } from './tasks/task-adaptive-video';
import { TaskIdentify } from './tasks/task-identify';
import { TaskScrubberImage } from './tasks/task-scrubber-image';
import { TaskThumbnail } from './tasks/task-thumbnail';

@Injectable()
export class ProcessorConsumer implements OnModuleInit {
  private readonly logger = new Logger(ProcessorConsumer.name);

  public constructor(
    private readonly config: Config,
    private readonly connection: AmqpConnection,
    private readonly httpService: HttpService,
    private readonly moduleRef: ModuleRef,
    private readonly redisService: RedisService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.registerTasks();
  }

  /** Registers tasks supported by the Video Processor and maps them to their corresponding handlers. */
  private async registerTasks(): Promise<void> {
    await this.registerTask(QueueTask.Identify, TaskIdentify);
    await this.registerTask(QueueTask.AdaptiveAudio, TaskAdaptiveAudio);
    await this.registerTask(QueueTask.AdaptiveVideo, TaskAdaptiveVideo);
    await this.registerTask(QueueTask.Thumbnail, TaskThumbnail);
    await this.registerTask(QueueTask.ScrubberImage, TaskScrubberImage);
  }

  /** Registers task and maps it to its corresponding handler. */
  private async registerTask<TQueueTask extends QueueTask>(
    queue: TQueueTask,
    handler: Type<Task<TQueueTask>>,
  ): Promise<void> {
    const handlerInstance = this.moduleRef.get(handler);
    await this.connection.createSubscriber<QueueMessages[TQueueTask]>(
      async message => await this.handle(queue, message, handlerInstance),
      {
        exchange: QueueExchange.Media,
        routingKey: queue,
        queue,
      },
      'run' satisfies keyof typeof handlerInstance,
    );
  }

  /** Wraps task handler and measures execution time. */
  private async handle<TQueueTask extends QueueTask>(
    task: TQueueTask,
    message: QueueMessages[TQueueTask] | undefined,
    handler: Task<TQueueTask>,
  ): Promise<void> {
    if (message === undefined) return this.logger.warn(`Received undefined for task: ${task}`);

    try {
      this.logger.log(`Executing task '${task}'`);
      const startTime = Date.now();
      await handler.run(message);
      const finishTime = Date.now();
      this.logger.log(`Task '${task}' finished in ${finishTime - startTime} ms`);
    } catch (error) {
      this.logger.log(`Task '${task}' failed:`, error);

      if ('videoId' in message) {
        await this.redisService.del(`${QueueTask.AdaptiveVideo}:${message.videoId}:*`);
        await firstValueFrom(
          this.httpService.patch<void, VideoUpdate>(
            `${this.config.video.apiUrlInternal}/v1/videos/${message.videoId}`,
            {
              status: 'failed',
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
}
