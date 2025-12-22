import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import { configureApplication } from './app.config';
import { UploadModule } from './upload.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UploadModule);
  configureApplication(app);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
