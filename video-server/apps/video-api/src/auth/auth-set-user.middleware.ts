import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

import { AccessToken } from '@video/lib/token';
import { AuthConstants } from '@video/lib/auth';
import { Config } from '@video/lib/config';
import { DatabaseService } from '@video/lib/database';

import { AuthRequestContext } from './auth-request.context';

@Injectable()
export class AuthSetUserMiddleware implements NestMiddleware {
  public constructor(
    private readonly config: Config,
    private readonly database: DatabaseService,
  ) {}

  public async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    request.user = await this.getRequestContext(request);
    return next();
  }

  private async getRequestContext(request: Request): Promise<AuthRequestContext> {
    const internal = this.isInternal(request);
    const context: AuthRequestContext = { internal };

    const authorizationHeader = this.getAuthorizationHeader(request);
    if (!authorizationHeader) return context;

    const encryptedToken = this.extractTokenFromAuthorizationHeader(authorizationHeader);
    if (!encryptedToken) return context;

    const accessToken = AccessToken.decrypt(encryptedToken);
    if (!accessToken) return context;

    const session = await this.database.authSession.findFirst({
      where: { id: accessToken.sessionId },
      include: { account: true },
    });

    if (!session) return context;

    context.account = session.account;
    context.session = session;

    return context;
  }

  private getAuthorizationHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }

  private extractTokenFromAuthorizationHeader(authorizationHeader: string): string | undefined {
    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private extractInternalKey(request: Request): string | null {
    const headers = request.headers[AuthConstants.InternalHeader.toLowerCase()];
    const header = Array.isArray(headers) ? headers[0] : headers;
    return header ?? null;
  }

  private isInternal(request: Request): boolean {
    const internalKey = this.extractInternalKey(request);
    return internalKey === this.config.video.apiInternalKey;
  }
}
