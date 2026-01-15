import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, ForbiddenError, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthInternal } from '../auth/auth-internal.guard';
import { AuthRequired } from '../auth/auth-required';
import { ReqAccount, ReqInternal } from '../auth/auth-request.context';
import {
  ImageDto,
  ImagesDto,
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
  public create(
    @ReqAccount() account: Account | null,
    @ReqInternal() isInternal: boolean,
    @Body(BodyValidator) body: VideoCreateDto,
  ) {
    if (!isInternal) this.ensureNoInternalFields(body);
    return this.videoService.createVideo(account, body);
  }

  @Patch(':videoId')
  @AuthRequired()
  @Serialize(VideoDto, ApiOkResponse)
  @ApiOperation({ summary: 'Update video details' })
  public update(
    @ReqAccount() account: Account | null,
    @ReqInternal() isInternal: boolean,
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoUpdateDto,
  ) {
    if (!isInternal) this.ensureNoInternalFields(body);
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
  @AuthInternal()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Update details about the uploaded video source file' })
  public async updateSource(
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoSourceUpdateDto,
  ) {
    await this.videoService.updateSource(videoId, body);
  }

  @Get(':videoId/thumbnails')
  @AuthRequired()
  @Serialize(ImagesDto, ApiOkResponse)
  @ApiOperation({ summary: 'List of available video thumbnails' })
  public listThumbnails(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Query(QueryValidator) query: ListQuery,
  ) {
    return this.videoService.listThumbnails(account, videoId, query);
  }

  @Get(':videoId/thumbnails/:thumbnailId')
  @AuthRequired()
  @Serialize(ImageDto, ApiOkResponse)
  @ApiOperation({ summary: 'List of available video thumbnails' })
  public findThumbnail(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('thumbnailId', IdPipe) thumbnailId: number,
  ) {
    return this.videoService.findThumbnail(account, videoId, thumbnailId);
  }

  @Delete(':videoId/thumbnails/:thumbnailId')
  @AuthRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the specific video thumbnail' })
  public deleteThumbnail(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('thumbnailId', IdPipe) thumbnailId: number,
  ) {
    return this.videoService.deleteThumbnail(account, videoId, thumbnailId);
  }

  private ensureNoInternalFields(body: VideoUpdateDto): void {
    const internalFields = ['duration', 'views', 'status'] as const;
    internalFields.forEach(field => {
      if (field in body && body[field] !== undefined) throw new ForbiddenError({ field });
    });
  }
}
