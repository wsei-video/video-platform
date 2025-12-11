import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { VideoCommentController } from './video-comment.controller';
import { VideoCommentService } from './video-comment.service';

@Module({
  controllers: [VideoCommentController],
  imports: [DatabaseModule],
  providers: [VideoCommentService],
})
export class VideoCommentModule {}
