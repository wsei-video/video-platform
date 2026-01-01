import { Global, Module } from '@nestjs/common';

import { Config, ConfigModule } from '../config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: RedisService,
      inject: [Config],
      useFactory: (config: Config) => new RedisService(config.redis),
    },
  ],
  exports: [RedisService],
  imports: [ConfigModule],
})
export class RedisModule {}
