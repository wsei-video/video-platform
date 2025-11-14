import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { Config, ConfigModule } from '../config';
import { QueueService } from './queue.service';
import { QueueExchange } from './queue.types';

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync({
      inject: [Config],
      imports: [ConfigModule],
      useFactory: (config: Config) => {
        const mqConfig = config.rabbitmq;
        return {
          exchanges: [{ name: QueueExchange.Media, type: 'direct' }],
          uri: `amqp://${mqConfig.user}:${mqConfig.password}@${mqConfig.host}:${mqConfig.port}`,
          connectionInitOptions: { wait: false },
        };
      },
    }),
  ],
  providers: [QueueService],
  exports: [RabbitMQModule, QueueService],
})
export class QueueModule {}
