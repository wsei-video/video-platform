import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { ReqAccount } from '../auth/auth-request.context';
import {
  VideoCreateDto,
  VideoDto,
  VideosDto,
  VideoSourceDto,
  VideoSourceUpdateDto,
  VideoUpdateDto,
  VideoUploadSourceDto,
} from './video.dto';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  public constructor(private readonly videoService: VideoService) {}

  @Get(':videoId')
  @Serialize(VideoDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get specific video' })
  public find(@ReqAccount() account: Account | null, @Param('videoId', IdPipe) videoId: number) {
    return this.videoService.findById(account, videoId);
  }

  @Get(':videoId/recommended')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get recommended videos for the specific video' })
  public async recommended(
    @ReqAccount() account: Account | null,
    @Param('videoId', IdPipe) videoId: number,
    @Query(QueryValidator) query: ListQuery,
  ) {
    return this.videoService.getRecommendedVideos(account, videoId, query);
  }

  @Post()
  @AuthRequired()
  @Serialize(VideoDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'Create a new video' })
  public create(@ReqAccount() account: Account, @Body(BodyValidator) body: VideoCreateDto) {
    return this.videoService.createVideo(account, body);
  }

  @Patch(':videoId')
  @AuthRequired()
  @Serialize(VideoDto, ApiOkResponse)
  @ApiOperation({ summary: 'Update video details' })
  public update(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoUpdateDto,
  ) {
    return this.videoService.updateVideo(account, videoId, body);
  }

  @Delete(':videoId')
  @AuthRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the specific video' })
  public delete(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoService.deleteVideo(account, videoId);
  }

  @Get(':videoId/source')
  @AuthRequired()
  @Serialize(VideoSourceDto, ApiOkResponse)
  @ApiOperation({ summary: 'Details about the uploaded video source file' })
  public findSource(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoService.findSource(account, videoId);
  }

  @Put(':videoId/source')
  @AuthRequired()
  @Serialize(VideoUploadSourceDto, ApiOkResponse)
  @ApiOperation({ summary: 'Retrieve video upload URL' })
  public createSource(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoService.createUploadUrl(account, videoId);
  }

  @Patch(':videoId/source')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Update details about the uploaded video source file' })
  public async updateSource(
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoSourceUpdateDto,
  ) {
    await this.videoService.updateSource(videoId, body);
  }
}
