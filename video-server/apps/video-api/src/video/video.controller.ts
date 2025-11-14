import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { VideoResponseDto } from './video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('trending')
  @ApiOkResponse({ type: [VideoResponseDto] })
  public getTrendingVideos() {
    return this.videoService.getTrendingVideos();
  }

  @Get('most-popular')
  @ApiOkResponse({ type: [VideoResponseDto] })
  public getMostPopularVideos() {
    return this.videoService.getMostPopularVideos();
  }

  @Get('recently-uploaded')
  @ApiOkResponse({ type: [VideoResponseDto] })
  public getRecentlyUploadedVideos() {
    return this.videoService.getRecentlyUploadedVideos();
  }

  @Get('for-you/:userId')
  @ApiOkResponse({ type: [VideoResponseDto] })
  public getForYouVideos(@Param('userId') userId: string) {
    return this.videoService.getForYouVideos(userId);
  }

  @Get(':videoId')
  @ApiOkResponse({ type: VideoResponseDto })
  public getVideoById(@Param('videoId') videoId: string) {
    const video = this.videoService.getVideoById(videoId);

    if (!video) throw new NotFoundException();

    return video;
  }

  @Get(':videoId/recommended')
  @ApiOkResponse({ type: [VideoResponseDto] })
  public getRecomendedVideos(@Param('videoId') videoId: string) {
    const videos = this.videoService.getRecomendedVideos(videoId);

    return videos;
  }
}
