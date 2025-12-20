import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { ReqAccount } from '../auth/auth-request.context';
import {
  VideoCommentRepliesDto,
  VideoCommentReplyCreateDto,
  VideoCommentReplyDto,
  VideoCommentReplyUpdateDto,
} from './video-comment.dto';
import { VideoCommentService } from './video-comment.service';

@Controller('videos/:videoId/comments/:commentId/replies')
export class VideoCommentReplyController {
  public constructor(private readonly videoCommentService: VideoCommentService) {}

  @Get()
  @Serialize(VideoCommentRepliesDto, ApiOkResponse)
  @ApiOperation({ summary: 'List video comment replies' })
  public list(
    @ReqAccount() account: Account | null,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
    @Query(QueryValidator) query: ListQuery,
  ) {
    return this.videoCommentService.listCommentReplies(account, videoId, commentId, query);
  }

  @Get(':replyId')
  @Serialize(VideoCommentReplyDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get a specific video comment reply' })
  public find(
    @ReqAccount() account: Account | null,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
    @Param('replyId', IdPipe) replyId: number,
  ) {
    return this.videoCommentService.findCommentReply(account, videoId, commentId, replyId);
  }

  @Post()
  @AuthRequired()
  @Serialize(VideoCommentReplyDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'Create a new video comment reply' })
  public comment(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
    @Body(BodyValidator) body: VideoCommentReplyCreateDto,
  ) {
    return this.videoCommentService.createCommentReply(account, videoId, commentId, body);
  }

  @Patch(':replyId')
  @AuthRequired()
  @Serialize(VideoCommentReplyDto, ApiOkResponse)
  @ApiOperation({ summary: 'Update video comment reply' })
  public update(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
    @Param('replyId', IdPipe) replyId: number,
    @Body(BodyValidator) body: VideoCommentReplyUpdateDto,
  ) {
    return this.videoCommentService.updateCommentReply(account, videoId, commentId, replyId, body);
  }

  @Delete(':replyId')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific video comment reply' })
  public delete(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('commentId', IdPipe) commentId: number,
    @Param('replyId', IdPipe) replyId: number,
  ) {
    return this.videoCommentService.deleteCommentReply(account, videoId, commentId, replyId);
  }
}
