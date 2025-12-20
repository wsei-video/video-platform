import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { VideoModule } from '../video/video.module';

@Module({
  controllers: [ChannelController],
  imports: [DatabaseModule, forwardRef(() => VideoModule)],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
