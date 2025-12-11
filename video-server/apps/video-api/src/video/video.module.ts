import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  controllers: [VideoController],
  imports: [DatabaseModule],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
