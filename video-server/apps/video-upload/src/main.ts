import { NestFactory } from '@nestjs/core';

import { UploadModule } from './upload.module';

async function bootstrap() {
  const app = await NestFactory.create(UploadModule);
  app.enableCors({ origin: [process.env.VIDEO_WEB_CLIENT_URL] });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
