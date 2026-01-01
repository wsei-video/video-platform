import { applyDecorators, UseGuards } from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ForbiddenError } from '@video/lib/restful';

@Injectable()
export class AuthInternalGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user?.internal) throw new ForbiddenError();
    return true;
  }
}

export const AuthInternal = () => applyDecorators(UseGuards(AuthInternalGuard));
