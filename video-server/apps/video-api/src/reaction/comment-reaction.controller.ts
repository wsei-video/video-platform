import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';

import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { CommentReactionCreateDto, CommentReactionDto, CommentReactionsDto } from './reaction.dto';
import { CommentReactionService } from './comment-reaction.service';
import { ReqAccount } from '../auth/auth-request.context';
import { Account } from '@video/lib/database/client';

@Controller('videos/:videoId/comments/:commentId/reactions')
export class CommentReactionController {
  public constructor(private readonly commentReactionService: CommentReactionService) {}

  @Get('')
  @Serialize(CommentReactionsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List comment reactions' })
  public list(@Param('commentId', IdPipe) commentId: number, @Query(QueryValidator) query: ListQuery) {
    return this.commentReactionService.listCommentReactions(commentId, query);
  }

  @Get('me')
  @AuthRequired()
  @Serialize(CommentReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get current user reaction on comment' })
  public me(@ReqAccount() account: Account, @Param('commentId', IdPipe) commentId: number) {
    return this.commentReactionService.getUserReaction(account, commentId);
  }

  @Get(':reactionId')
  @Serialize(CommentReactionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get a specific comment reaction' })
  public find(@Param('commentId', IdPipe) commentId: number, @Param('reactionId', IdPipe) reactionId: number) {
    return this.commentReactionService.getReaction(commentId, reactionId);
  }

  @Post('')
  @AuthRequired()
  @Serialize(CommentReactionDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'React to a comment (creates or updates existing reaction)' })
  public react(
    @ReqAccount() account: Account,
    @Param('commentId', IdPipe) commentId: number,
    @Body(BodyValidator) body: CommentReactionCreateDto,
  ) {
    return this.commentReactionService.reactToComment(account, commentId, body);
  }

  @Delete(':reactionId')
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

  @Delete('')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove current user reaction from comment' })
  public removeReaction(@ReqAccount() account: Account, @Param('commentId', IdPipe) commentId: number) {
    return this.commentReactionService.deleteUserReaction(account, commentId);
  }
}
