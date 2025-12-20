import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

import { DatabaseService } from '@video/lib/database';

import { AccessToken } from './access-token';

@Injectable()
export class AuthSetUserMiddleware implements NestMiddleware {
  public constructor(private readonly database: DatabaseService) {}

  public async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = this.getAuthorizationHeader(request);
    if (!authorizationHeader) return next();

    const encryptedToken = this.extractTokenFromAuthorizationHeader(authorizationHeader);
    if (!encryptedToken) return next();

    const accessToken = AccessToken.decrypt(encryptedToken);
    if (!accessToken) return next();

    const session = await this.database.authSession.findFirst({
      where: { id: accessToken.sessionId },
      include: { account: true },
    });

    if (!session) return next();

    request.user = { account: session.account, session };

    return next();
  }

  private getAuthorizationHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }

  private extractTokenFromAuthorizationHeader(authorizationHeader: string): string | undefined {
    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
