import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import loader from './config.loader';
import { Config } from './config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [loader],
      envFilePath: ['.env'],
    }),
  ],
  providers: [Config],
  exports: [Config],
})
export class ConfigModule {}
