import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';
import { HelloModule } from '@video/lib/hello';
import { providePrismaClientExceptionFilter } from '@video/lib/restful';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { AuthSessionModule } from './auth-session/auth-session.module';
import { AuthSetUserMiddleware } from './auth/auth-set-user.middleware';
import { ChannelModule } from './channel/channel.module';
import { provideAuthSessionStampInterceptor } from './auth/auth-session-stamp.interceptor';
import { ReactionModule } from './reaction/reaction.module';
import { SearchModule } from './search/search.module';
import { VideoCommentModule } from './video-comment/video-comment.module';
import { VideoFeedModule } from './video-feed/video-feed.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    AccountModule,
    AuthModule,
    AuthSessionModule,
    ChannelModule,
    DatabaseModule,
    HelloModule.forRoot({ serviceName: 'Video API Service' }),
    ReactionModule,
    SearchModule,
    VideoCommentModule,
    VideoFeedModule,
    VideoModule,
  ],
  providers: [provideAuthSessionStampInterceptor(), providePrismaClientExceptionFilter()],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthSetUserMiddleware).forRoutes('*all');
  }
}
