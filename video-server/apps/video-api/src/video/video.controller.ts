import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { IdPipe, Serialize } from '@video/lib/restful';

import { AuthGuard } from '../auth/auth.guard';
import { VideoDto, VideosDto } from './video.dto';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  public constructor(private readonly videoService: VideoService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(VideosDto, ApiOkResponse)
  public list() {}

  @Get(':videoId')
  @Serialize(VideoDto, ApiOkResponse)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(@Param('videoId', IdPipe) videoId: number) {}

  @Get(':videoId/recommended')
  @Serialize(VideosDto, ApiOkResponse)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public recommended(@Param('videoId', IdPipe) videoId: number) {}

  @Post()
  @Serialize(VideoDto, ApiOkResponse)
  public create() {}

  @Patch(':videoId')
  @Serialize(VideoDto, ApiOkResponse)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(@Param('videoId', IdPipe) videoId: number) {}

  @Delete(':videoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete(@Param('videoId', IdPipe) videoId: number) {}
}
