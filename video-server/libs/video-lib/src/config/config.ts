import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig, DatabaseConfig, RabbitMQConfig, RedisConfig, MinioConfig, VideoConfig } from './config.types';

@Injectable()
export class Config {
  public constructor(private readonly configService: ConfigService<AppConfig>) {}

  public get database(): DatabaseConfig {
    return this.configService.getOrThrow<DatabaseConfig>('database');
  }

  public get rabbitmq(): RabbitMQConfig {
    return this.configService.getOrThrow<RabbitMQConfig>('rabbitmq');
  }

  public get redis(): RedisConfig {
    return this.configService.getOrThrow<RedisConfig>('redis');
  }

  public get minio(): MinioConfig {
    return this.configService.getOrThrow<MinioConfig>('minio');
  }

  public get video(): VideoConfig {
    return this.configService.getOrThrow<VideoConfig>('video');
  }
}
