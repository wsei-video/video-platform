import { Module } from '@nestjs/common';
import { DatabaseModule } from '@video/lib/database';

import { VideoReactionController } from './video-reaction.controller';
import { CommentReactionController } from './comment-reaction.controller';
import { VideoReactionService } from './video-reaction.service';
import { CommentReactionService } from './comment-reaction.service';

@Module({
  controllers: [VideoReactionController, CommentReactionController],
  imports: [DatabaseModule],
  providers: [VideoReactionService, CommentReactionService],
  exports: [VideoReactionService, CommentReactionService],
})
export class ReactionModule {}
