import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import dotenv from 'dotenv';
import expand from 'dotenv-expand';

import { AppModule } from './app.module';
import { configureApplication } from './app.config';

expand.expand(dotenv.config({ path: '.env', override: true }));

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApplication(app);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
