import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { ListQuery, Serialize } from '@video/lib/restful';

import { VideoFeedService } from './video-feed.service';
import { VideosDto } from '../video/video.dto';

@Controller('video/feed')
export class VideoFeedController {
  public constructor(private readonly videoFeedService: VideoFeedService) {}

  @Get('trending')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List trending videos on the platform' })
  public trending(query: ListQuery) {
    return this.videoFeedService.getTrendingVideos(query);
  }

  @Get('most-popular')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List the most popular videos on the platform' })
  public mostPopular(query: ListQuery) {
    return this.videoFeedService.getMostPopularVideos(query);
  }

  @Get('recently-uploaded')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List the recently uploaded videos on the platform' })
  public recentlyUploaded(query: ListQuery) {
    return this.videoFeedService.getRecentlyUploadedVideos(query);
  }

  @Get('for-you')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List recommended videos for the signed in user' })
  public forYou(query: ListQuery) {
    return this.videoFeedService.getForYouVideos(query);
  }
}
