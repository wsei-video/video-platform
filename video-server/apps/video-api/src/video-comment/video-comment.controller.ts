import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { Serialize } from '@video/lib/restful';

import { AuthRequired } from '../auth/auth-required';
import { VideoCommentDto, VideoCommentsDto } from './video-comment.dto';
import { VideoCommentService } from './video-comment.service';

@Controller('videos/:videoId/comments')
export class VideoCommentController {
  public constructor(private readonly videoCommentService: VideoCommentService) {}

  @Get('')
  @Serialize(VideoCommentsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List video comments' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public list(@Param('videoId') videoId: string) {}

  @Get(':commentId')
  @Serialize(VideoCommentDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get a specific video comment' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(@Param('videoId') videoId: string, @Param('commentId') commentId: string) {}

  @Post('')
  @AuthRequired()
  @Serialize(VideoCommentDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'Create a new video comment' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public create(@Param('videoId') videoId: string) {}

  @Patch(':commentId')
  @AuthRequired()
  @Serialize(VideoCommentDto, ApiOkResponse)
  @ApiOperation({ summary: 'Update video comment details' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(@Param('videoId') videoId: string, @Param('commentId') commentId: string) {}

  @Delete(':commentId')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific video comment' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete(@Param('videoId') videoId: string, @Param('commentId') commentId: string) {}
}
