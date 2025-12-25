import { Module } from '@nestjs/common';

import { ConfigModule } from '@video/lib/config';
import { DatabaseModule } from '@video/lib/database';

import { VideoStreamController } from './video-stream.controller';
import { VideoStreamService } from './video-stream.service';

@Module({
  controllers: [VideoStreamController],
  imports: [ConfigModule, DatabaseModule],
  providers: [VideoStreamService],
})
export class VideoStreamModule {}
