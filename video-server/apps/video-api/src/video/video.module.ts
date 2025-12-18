import { Module } from '@nestjs/common';

import { ChannelModule } from '../channel/channel.module';
import { DatabaseModule } from '@video/lib/database';

import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  controllers: [VideoController],
  imports: [DatabaseModule, ChannelModule],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
