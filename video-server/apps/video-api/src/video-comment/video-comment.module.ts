import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { VideoCommentController } from './video-comment.controller';
import { VideoCommentReplyController } from './video-comment-reply.controller';
import { VideoCommentService } from './video-comment.service';

@Module({
  controllers: [VideoCommentController, VideoCommentReplyController],
  imports: [DatabaseModule],
  providers: [VideoCommentService],
})
export class VideoCommentModule {}
