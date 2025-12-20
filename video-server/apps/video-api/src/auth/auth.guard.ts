import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UnauthorizedError } from '@video/lib/restful';

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user) throw new UnauthorizedError();
    return true;
  }
}
