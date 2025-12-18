import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';

import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { VideoReactionCreateDto, VideoReactionDto, VideoReactionsDto } from './reaction.dto';
import { VideoReactionService } from './video-reaction.service';
import { ReqAccount } from '../auth/auth-request.context';
import { Account } from '@video/lib/database/client';

@Controller('videos/:videoId/reactions')
export class VideoReactionController {
  public constructor(private readonly videoReactionService: VideoReactionService) {}

  @Get('')
  @Serialize(VideoReactionsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List video reactions' })
  public list(@Param('videoId', IdPipe) videoId: number, @Query(QueryValidator) query: ListQuery) {
    return this.videoReactionService.listVideoReactions(videoId, query);
  }

  @Get('me')
  @AuthRequired()
  @Serialize(VideoReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get current user reaction on video' })
  public me(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoReactionService.getUserReaction(account, videoId);
  }

  @Get(':reactionId')
  @Serialize(VideoReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get a specific video reaction' })
  public find(@Param('videoId', IdPipe) videoId: number, @Param('reactionId', IdPipe) reactionId: number) {
    return this.videoReactionService.getReaction(videoId, reactionId);
  }

  @Post('')
  @AuthRequired()
  @Serialize(VideoReactionDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'React to a video (creates or updates existing reaction)' })
  public react(
    @ReqAccount() account: Account,
    @Param('videoId', IdPipe) videoId: number,
    @Body(BodyValidator) body: VideoReactionCreateDto,
  ) {
    return this.videoReactionService.reactToVideo(account, videoId, body);
  }

  @Delete(':reactionId')
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

  @Delete('')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove current user reaction from video' })
  public removeReaction(@ReqAccount() account: Account, @Param('videoId', IdPipe) videoId: number) {
    return this.videoReactionService.deleteUserReaction(account, videoId);
  }
}
