import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { VideoFeedController } from './video-feed.controller';
import { VideoFeedService } from './video-feed.service';
import { VideoModule } from '../video/video.module';

@Module({
  controllers: [VideoFeedController],
  imports: [VideoModule, DatabaseModule],
  providers: [VideoFeedService],
})
export class VideoFeedModule {}
