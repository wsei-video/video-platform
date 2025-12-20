import { ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, Query } from '@nestjs/common';

import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { VideoReactionCreateDto, VideoReactionDto, VideoReactionsDto } from './reaction.dto';
import { VideoReactionService } from './video-reaction.service';
import { ReqAccount } from '../auth/auth-request.context';
import { Account } from '@video/lib/database/client';

@Controller('videos/:videoId')
export class VideoReactionController {
  public constructor(private readonly videoReactionService: VideoReactionService) {}

  @Get('reactions')
  @Serialize(VideoReactionsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List video reactions' })
  public list(@Param('videoId', IdPipe) videoId: number, @Query(QueryValidator) query: ListQuery) {
    return this.videoReactionService.listVideoReactions(videoId, query);
  }

  @Get('reactions/:reactionId')
  @Serialize(VideoReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get a specific video reaction' })
  public find(@Param('videoId', IdPipe) videoId: number, @Param('reactionId', IdPipe) reactionId: number) {
    return this.videoReactionService.getReaction(videoId, reactionId);
  }

  @Delete('reactions/:reactionId')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific video reaction' })
  public delete(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Param('reactionId', IdPipe) reactionId: number,
  ) {
    return this.videoReactionService.deleteReaction(account, videoId, reactionId);
  }

  @Get('reaction')
  @AuthRequired()
  @Serialize(VideoReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get current user video reaction' })
  public reaction(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoReactionService.getUserReaction(account, videoId);
  }

  @Put('reaction')
  @AuthRequired()
  @Serialize(VideoReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Create of update video reaction as current user' })
  public react(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoReactionCreateDto,
  ) {
    return this.videoReactionService.reactToVideo(account, videoId, body);
  }

  @Delete('reaction')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete current user video reaction' })
  public removeReaction(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoReactionService.deleteUserReaction(account, videoId);
  }
}
