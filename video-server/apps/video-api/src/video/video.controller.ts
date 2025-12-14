import { ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { IdPipe, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { VideoDto, VideosDto } from './video.dto';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  public constructor(private readonly videoService: VideoService) {}

  @Get(':videoId')
  @Serialize(VideoDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get specific video' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(@Param('videoId', IdPipe) videoId: number) {}

  @Get(':videoId/recommended')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get recommended videos for the specific video' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public recommended(@Param('videoId', IdPipe) videoId: number) {}

  @Post()
  @AuthRequired()
  @Serialize(VideoDto, ApiOkResponse)
  @ApiOperation({ summary: 'Create a new video' })
  public create() {}

  @Patch(':videoId')
  @AuthRequired()
  @Serialize(VideoDto, ApiOkResponse)
  @ApiOperation({ summary: 'Update video details' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(@Param('videoId', IdPipe) videoId: number) {}

  @Delete(':videoId')
  @AuthRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the specific video' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete(@Param('videoId', IdPipe) videoId: number) {}
}
