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

  @Get(':videoId')
  @ApiOkResponse({ type: VideoResponseDto })
  public getVideoById(@Param('videoId') videoId: string) {
    const video = this.videoService.getVideoById(videoId);

    if (!video) throw new NotFoundException();

    return video;
  }

  @Get(':videoId/recomended')
  @ApiOkResponse({ type: [VideoResponseDto] })
  public getRecomendedVideos(@Param('videoId') videoId: string) {
    const videos = this.videoService.getRecomendedVideos(videoId);

    return videos;
  }
}
