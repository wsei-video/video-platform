import { Injectable } from '@nestjs/common';

import { AccessToken } from '@video/lib/token';
import { Account, AuthSession } from '@video/lib/database/client';
import { BadRequestError, ListQuery } from '@video/lib/restful';
import { DatabaseService } from '@video/lib/database';
import { DateUtils, UserAgentInfo } from '@video/lib/utils';
import { Hasher } from '@video/lib/crypto';

import { AccountCreateDto } from '../account/account.dto';
import { AuthDto } from './auth.dto';
import { AuthSessionDto, AuthSessionCreateDto, AuthSessionsDto } from '../auth-session/auth-session.dto';

@Injectable()
export class AuthService {
  public constructor(private readonly database: DatabaseService) {}

  public getCurrentAuth(account: Account, session: AuthSessionDto): AuthDto {
    const accessToken = new AccessToken({ accountId: account.id, sessionId: session.id });
    return { account, session, accessToken: accessToken.encrypt() };
  }

  public async register(body: AccountCreateDto, userAgentInfo: UserAgentInfo): Promise<AuthDto> {
    const account = await this.createAccount(body);
    const session = await this.createSession(account, userAgentInfo);
    const accessToken = new AccessToken({ accountId: account.id, sessionId: session.id });
    return { account, session, accessToken: accessToken.encrypt() };
  }

  public async login(body: AuthSessionCreateDto, userAgentInfo: UserAgentInfo) {
    const account = await this.database.account.findFirst({ where: { email: body.email } });
    if (!account) throw new BadRequestError({ name: 'InvalidCredentials' });

    const isPasswordValid = await Hasher.verify(body.password, account.passwordHash);
    if (!isPasswordValid) throw new BadRequestError({ name: 'InvalidCredentials' });

    const session = await this.createSession(account, userAgentInfo);
    const accessToken = new AccessToken({ accountId: account.id, sessionId: session.id });

    return { account, session, accessToken: accessToken.encrypt() };
  }

  public async listSessions(accountId: number, query: ListQuery): Promise<AuthSessionsDto> {
    const sessions = await this.database.authSession.findMany({
      where: { accountId },
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: { lastAccessAt: 'desc' },
    });

    const total = await this.database.authSession.count({ where: { accountId } });
    const next = total > (query.page - 1) * query.count + sessions.length;
    return { items: sessions, total, next };
  }

  public findSession(accountId: number, sessionId: number) {
    return this.database.authSession.findFirstOrThrow({ where: { accountId, id: sessionId } });
  }

  public createSession(account: Account, userAgentInfo: UserAgentInfo) {
    const now = DateUtils.now();

    return this.database.authSession.create({
      data: {
        accountId: account.id,
        browser: userAgentInfo.browser,
        device: userAgentInfo.device,
        createdAt: now,
        lastAccessAt: now,
      },
    });
  }

  public deleteSession(accountId: number, sessionId: number) {
    return this.database.authSession.delete({ where: { accountId, id: sessionId } });
  }

  public async logout(session: AuthSessionDto) {
    await this.database.authSession.delete({ where: { id: session.id } });
  }

  public async updateSessionLastAccessAt(session: AuthSession) {
    const now = DateUtils.now();
    await this.database.authSession.update({ where: { id: session.id }, data: { lastAccessAt: now } });
    session.lastAccessAt = now;
  }

  private async createAccount(body: AccountCreateDto) {
    const passwordHash = await Hasher.hash(body.password);

    return await this.database.account.create({
      data: {
        email: body.email.toLowerCase(),
        name: body.name,
        passwordHash,
        createdAt: DateUtils.now(),
      },
    });
  }
}
