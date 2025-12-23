import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Mock, vi } from 'vitest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { DateUtils } from '@video/lib/utils';
import { QueueExchange, QueueMessages, QueueModule, QueueTask } from '@video/lib/queue';
import { StorageService } from '@video/lib/storage';

import { configureApplication } from '../../src/app.config';
import { UploadModule } from '../../src/upload.module';

export class TestingFixture {
  private readonly connection: AmqpConnection;

  public readonly storage: StorageService;
  public readonly dateSpy: Mock<() => Date>;

  private constructor(
    public readonly app: NestExpressApplication,
    public readonly module: TestingModule,
  ) {
    this.connection = app.get(AmqpConnection);
    this.storage = app.get(StorageService);
    this.dateSpy = vi.spyOn(DateUtils, 'now').mockReturnValue(new Date('2025-10-01T10:00:00.000Z'));
  }

  public static async create() {
    const builder = Test.createTestingModule({ imports: [UploadModule, QueueModule] });
    const module = await builder.compile();
    const app = module.createNestApplication<NestExpressApplication>();
    configureApplication(app);
    await app.init();
    return new TestingFixture(app, module);
  }

  public async destroy() {
    await this.app.close();
  }

  public request() {
    return request(this.app.getHttpServer());
  }

  public async queue<TQueueTask extends QueueTask>(exchange: QueueExchange, task: TQueueTask) {
    const queue = new TestingQueue<TQueueTask>(this.connection);
    await queue.create(exchange, task);
    return queue;
  }
}

export class TestingQueue<TQueueTask extends QueueTask> {
  private consumerTag?: string;

  public readonly messages: QueueMessages[TQueueTask][] = [];

  public constructor(private readonly connection: AmqpConnection) {}

  public async create(exchange: QueueExchange, queue: QueueTask) {
    const subscriber = await this.connection.createSubscriber<QueueMessages[TQueueTask]>(
      message => {
        return new Promise(resolve => {
          if (message) this.messages.push(message);
          resolve();
        });
      },
      { exchange, queue, routingKey: queue },
      'run',
    );
    this.consumerTag = subscriber.consumerTag;
  }

  public async destroy() {
    if (!this.consumerTag) return;
    await this.connection.cancelConsumer(this.consumerTag);
    this.consumerTag = undefined;
  }
}
