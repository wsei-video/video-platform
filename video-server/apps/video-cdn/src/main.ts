import { NestFactory } from '@nestjs/core';

import { CdnModule } from './cdn.module';

async function bootstrap() {
  const app = await NestFactory.create(CdnModule);
  app.enableCors({ origin: [process.env.VIDEO_WEB_CLIENT_URL] });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
