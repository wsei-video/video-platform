import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { Serialize } from '@video/lib/restful';

import { VideoFeedService } from './video-feed.service';
import { VideosDto } from '../video/video.dto';

@Controller('video/feed')
export class VideoFeedController {
  public constructor(private readonly videoFeedService: VideoFeedService) {}

  @Get('trending')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List trending videos on the platform' })
  public trending() {
    return this.videoFeedService.getTrendingVideos();
  }

  @Get('most-popular')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List the most popular videos on the platform' })
  public mostPopular() {
    return this.videoFeedService.getMostPopularVideos();
  }

  @Get('recently-uploaded')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List the recently uploaded videos on the platform' })
  public recentlyUploaded() {
    return this.videoFeedService.getRecentlyUploadedVideos();
  }

  @Get('for-you')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List recommended videos for the signed in user' })
  public forYou() {
    return this.videoFeedService.getForYouVideos();
  }
}
