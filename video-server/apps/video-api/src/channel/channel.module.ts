import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  imports: [DatabaseModule],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
