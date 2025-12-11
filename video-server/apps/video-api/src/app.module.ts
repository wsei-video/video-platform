import { Module } from '@nestjs/common';

import { HelloModule } from '@video/lib/hello';
import { providePrismaClientExceptionFilter } from '@video/lib/restful';

import { AuthModule } from './auth/auth.module';
import { AuthSessionModule } from './auth-session/auth-session.module';
import { SearchModule } from './search/search.module';
import { VideoCommentModule } from './video-comment/video-comment.module';
import { VideoFeedModule } from './video-feed/video-feed.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    AuthModule,
    AuthSessionModule,
    HelloModule.forRoot({ serviceName: 'Video API Service' }),
    SearchModule,
    VideoCommentModule,
    VideoFeedModule,
    VideoModule,
  ],
  providers: [providePrismaClientExceptionFilter()],
})
export class AppModule {}
