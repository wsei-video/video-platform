import { ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, Query } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { VideoCommentReactionCreateDto, VideoCommentReactionDto, VideoCommentReactionsDto } from './reaction.dto';
import { VideoCommentReactionService } from './video-comment-reaction.service';
import { ReqAccount } from '../auth/auth-request.context';

@Controller('videos/:videoId/comments/:commentId')
export class VideoCommentReactionController {
  public constructor(private readonly commentReactionService: VideoCommentReactionService) {}

  @Get('reactions')
  @Serialize(VideoCommentReactionsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List comment reactions' })
  public list(@Param('commentId', IdPipe) commentId: number, @Query(QueryValidator) query: ListQuery) {
    return this.commentReactionService.listCommentReactions(commentId, query);
  }

  @Get('reactions/:reactionId')
  @Serialize(VideoCommentReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get a specific comment reaction' })
  public find(@Param('commentId', IdPipe) commentId: number, @Param('reactionId', IdPipe) reactionId: number) {
    return this.commentReactionService.getReaction(commentId, reactionId);
  }

  @Delete('reactions/:reactionId')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific comment reaction' })
  public delete(
    @ReqAccount() account: Account,
    @Param('commentId', IdPipe) commentId: number,
    @Param('reactionId', IdPipe) reactionId: number,
  ) {
    return this.commentReactionService.deleteReaction(account, commentId, reactionId);
  }

  @Get('reaction')
  @AuthRequired()
  @Serialize(VideoCommentReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get current user reaction on comment' })
  public me(@ReqAccount() account: Account, @Param('commentId', IdPipe) commentId: number) {
    return this.commentReactionService.getUserReaction(account, commentId);
  }

  @Put('reaction')
  @AuthRequired()
  @Serialize(VideoCommentReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Create or update comment reaction as current user' })
  public react(
    @ReqAccount() account: Account,
    @Param('commentId', IdPipe) commentId: number,
    @Body(BodyValidator) body: VideoCommentReactionCreateDto,
  ) {
    return this.commentReactionService.reactToComment(account, commentId, body);
  }

  @Delete('reaction')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove current user comment reaction' })
  public removeReaction(@ReqAccount() account: Account, @Param('commentId', IdPipe) commentId: number) {
    return this.commentReactionService.deleteUserReaction(account, commentId);
  }
}
