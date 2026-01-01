import { ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, IdPipe, Serialize } from '@video/lib/restful';

import { AudioStreamCreateDto, MediaStreamsDto, VideoStreamCreateDto } from './video-stream.dto';
import { AuthInternal } from '../auth/auth-internal.guard';
import { ReqAccount } from '../auth/auth-request.context';
import { VideoStreamService } from './video-stream.service';

@Controller('videos/:videoId/streams')
export class VideoStreamController {
  public constructor(private readonly videoStreamService: VideoStreamService) {}

  @Get()
  @Serialize(MediaStreamsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List media streams' })
  public list(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoStreamService.list(account, videoId);
  }

  @Post('video')
  @AuthInternal()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Create video stream' })
  public async createVideoStream(
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoStreamCreateDto,
  ) {
    await this.videoStreamService.createVideoStream(videoId, body);
  }

  @Post('audio')
  @AuthInternal()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Create audio stream' })
  public async createAudioStream(
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: AudioStreamCreateDto,
  ) {
    await this.videoStreamService.createAudioStream(videoId, body);
  }
}
