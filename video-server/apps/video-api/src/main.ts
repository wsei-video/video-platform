import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: [process.env.VIDEO_WEB_CLIENT_URL] });

  const config = new DocumentBuilder().setTitle('Video platform API').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger.json',
    yamlDocumentUrl: 'swagger.yaml',
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
