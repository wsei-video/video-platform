import { APP_INTERCEPTOR } from '@nestjs/core';
import { CallHandler, ClassProvider, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { AuthService } from './auth.service';

@Injectable()
export class AuthSessionStampInterceptor implements NestInterceptor {
  public constructor(private readonly authService: AuthService) {}

  public async intercept(context: ExecutionContext, next: CallHandler<unknown>): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const session = request.user?.session;
    if (session) await this.authService.updateSessionLastAccessAt(session);
    return next.handle();
  }
}

export const provideAuthSessionStampInterceptor = (): ClassProvider<AuthSessionStampInterceptor> => ({
  provide: APP_INTERCEPTOR,
  useClass: AuthSessionStampInterceptor,
});
