import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const configureApplication = (app: NestExpressApplication): NestExpressApplication => {
  if (process.env.VIDEO_WEB_CLIENT_URL) app.enableCors({ origin: [process.env.VIDEO_WEB_CLIENT_URL] });

  const config = new DocumentBuilder().setTitle('Video platform CDN').setVersion('1.0').addBearerAuth().build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger.json',
    yamlDocumentUrl: 'swagger.yaml',
  });

  return app;
};
