import { Module } from '@nestjs/common';
import { DatabaseModule } from '@video/lib/database';

import { VideoCommentReactionController } from './video-comment-reaction.controller';
import { VideoCommentReactionService } from './video-comment-reaction.service';
import { VideoReactionController } from './video-reaction.controller';
import { VideoReactionService } from './video-reaction.service';

@Module({
  controllers: [VideoReactionController, VideoCommentReactionController],
  imports: [DatabaseModule],
  providers: [VideoReactionService, VideoCommentReactionService],
  exports: [VideoReactionService, VideoCommentReactionService],
})
export class ReactionModule {}
