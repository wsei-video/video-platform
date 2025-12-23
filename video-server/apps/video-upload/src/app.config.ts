import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

export const configureApplication = (app: NestExpressApplication): NestExpressApplication => {
  if (process.env.VIDEO_WEB_CLIENT_URL) app.enableCors({ origin: [process.env.VIDEO_WEB_CLIENT_URL] });

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const config = new DocumentBuilder().setTitle('Video platform upload').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger.json',
    yamlDocumentUrl: 'swagger.yaml',
  });

  return app;
};
