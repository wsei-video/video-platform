import { NestFactory } from '@nestjs/core';

import { ProcessorModule } from './processor.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(ProcessorModule);
}

void bootstrap();
