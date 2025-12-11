import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { VideoCommentService } from './video-comment.service';
import { VideoDto } from '../video/video.dto';

@Controller('videos/:videoId/comments')
export class VideoCommentController {
  public constructor(private readonly videoCommentService: VideoCommentService) {}

  @Get('')
  @ApiOkResponse({ type: [VideoDto] })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public list(@Param('videoId') videoId: string) {}

  @Get(':commentId')
  @ApiOkResponse({ type: [VideoDto] })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(@Param('videoId') videoId: string, @Param('commentId') commentId: string) {}

  @Post('')
  @ApiOkResponse({ type: VideoDto })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public create(@Param('videoId') videoId: string) {}

  @Patch(':commentId')
  @ApiOkResponse({ type: VideoDto })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(@Param('videoId') videoId: string, @Param('commentId') commentId: string) {}

  @Delete(':commentId')
  @ApiOkResponse({ type: VideoDto })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete(@Param('videoId') videoId: string, @Param('commentId') commentId: string) {}
}
