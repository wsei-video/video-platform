import { Module } from '@nestjs/common';

import { HelloModule } from '@video/lib/hello';

import { VideoModule } from './video/video.module';

@Module({
  imports: [VideoModule, HelloModule.forRoot({ serviceName: 'Video API Service' })],
})
export class AppModule {}
