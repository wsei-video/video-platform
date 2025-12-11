import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { DatabaseService } from '@video/lib/database';
import { UnauthorizedError } from '@video/lib/restful';

import { AccessToken } from './access-token';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly database: DatabaseService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorizationHeader = this.getAuthorizationHeader(request);
    if (!authorizationHeader) throw new UnauthorizedError();

    const encryptedToken = this.extractTokenFromAuthorizationHeader(authorizationHeader);
    if (!encryptedToken) throw new UnauthorizedError();

    const accessToken = AccessToken.decrypt(encryptedToken);
    if (!accessToken) throw new UnauthorizedError();

    const session = await this.database.authSession.findFirst({
      where: { id: accessToken.sessionId },
      include: { account: true },
    });

    if (!session) throw new UnauthorizedError();

    request.user = { account: session.account, session };
    return true;
  }

  private getAuthorizationHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }

  private extractTokenFromAuthorizationHeader(authorizationHeader: string): string | undefined {
    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
