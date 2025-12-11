import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Account, AuthSession } from '@video/lib/database/client';

export const ReqAccount = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest<Request>().user?.account;
});

export const ReqSession = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest<Request>().user?.session;
});

export type AuthRequestContext = { account: Account; session: AuthSession };
