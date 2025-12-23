import { forwardRef, Module } from '@nestjs/common';

import { ConfigModule } from '@video/lib/config';
import { DatabaseModule } from '@video/lib/database';

import { ChannelModule } from '../channel/channel.module';
import { VideoCommonService } from './video-common.service';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  controllers: [VideoController],
  imports: [ConfigModule, DatabaseModule, forwardRef(() => ChannelModule)],
  providers: [VideoService, VideoCommonService],
  exports: [VideoService, VideoCommonService],
})
export class VideoModule {}
