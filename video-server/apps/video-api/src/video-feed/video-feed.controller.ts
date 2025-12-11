import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { VideoFeedService } from './video-feed.service';
import { VideoDto } from '../video/video.dto';

@Controller('video/feed')
export class VideoFeedController {
  public constructor(private readonly videoFeedService: VideoFeedService) {}

  @Get('trending')
  @ApiOkResponse({ type: [VideoDto] })
  public trending() {
    return this.videoFeedService.getTrendingVideos();
  }

  @Get('most-popular')
  @ApiOkResponse({ type: [VideoDto] })
  public mostPopular() {
    return this.videoFeedService.getMostPopularVideos();
  }

  @Get('recently-uploaded')
  @ApiOkResponse({ type: [VideoDto] })
  public recentlyUploaded() {
    return this.videoFeedService.getRecentlyUploadedVideos();
  }

  @Get('for-you')
  @ApiOkResponse({ type: [VideoDto] })
  public forYou() {
    return this.videoFeedService.getForYouVideos();
  }
}
