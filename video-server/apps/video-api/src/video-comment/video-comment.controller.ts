import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { VideoCommentCreateDto, VideoCommentDto, VideoCommentsDto, VideoCommentUpdateDto } from './video-comment.dto';
import { VideoCommentService } from './video-comment.service';
import { ReqAccount } from '../auth/auth-request.context';
import { Account } from '@video/lib/database/client';

@Controller('videos/:videoId/comments')
export class VideoCommentController {
  public constructor(private readonly videoCommentService: VideoCommentService) {}

  @Get('')
  @Serialize(VideoCommentsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List video comments' })
  public list(
    @ReqAccount() account: Account | null,
    @Param('videoId', IdPipe) videoId: number,
    @Query(QueryValidator) query: ListQuery,
  ) {
    return this.videoCommentService.listVideoComments(account, videoId, query);
  }

  @Get(':commentId')
  @Serialize(VideoCommentDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get a specific video comment' })
  public find(
    @ReqAccount() account: Account | null,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
  ) {
    return this.videoCommentService.findComment(account, videoId, commentId);
  }

  @Post('')
  @AuthRequired()
  @Serialize(VideoCommentDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'Create a new video comment' })
  public create(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoCommentCreateDto,
  ) {
    return this.videoCommentService.createComment(account, videoId, body);
  }

  @Patch(':commentId')
  @AuthRequired()
  @Serialize(VideoCommentDto, ApiOkResponse)
  @ApiOperation({ summary: 'Update video comment details' })
  public update(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
    @Body(BodyValidator) body: VideoCommentUpdateDto,
  ) {
    return this.videoCommentService.updateComment(account, videoId, commentId, body);
  }

  @Delete(':commentId')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific video comment' })
  public delete(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
  ) {
    return this.videoCommentService.deleteComment(account, videoId, commentId);
  }
}
