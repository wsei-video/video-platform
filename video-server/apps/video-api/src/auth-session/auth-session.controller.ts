import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';
import { UserAgentUtils } from '@video/lib/utils';

import { AuthDto } from '../auth/auth.dto';
import { AuthRequired } from '../auth/auth-required';
import { AuthService } from '../auth/auth.service';
import { AuthSessionDto, AuthSessionCreateDto, AuthSessionsDto } from './auth-session.dto';
import { ReqAccount } from '../auth/auth-request.context';

@Controller('auth/sessions')
export class AuthSessionController {
  public constructor(private readonly authService: AuthService) {}

  @Get()
  @AuthRequired()
  @Serialize(AuthSessionsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List active sessions associated with the account' })
  public list(@ReqAccount() account: Account, @Query(QueryValidator) query: ListQuery) {
    return this.authService.listSessions(account.id, query);
  }

  @Get(':sessionId')
  @AuthRequired()
  @Serialize(AuthSessionDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get an active session associated with the account' })
  public find(@ReqAccount() account: Account, @Param('sessionId', IdPipe) sessionId: number) {
    return this.authService.findSession(account.id, sessionId);
  }

  @Post()
  @Serialize(AuthDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'Sign in to an account and create a session' })
  public create(@Body(BodyValidator) body: AuthSessionCreateDto, @Headers('user-agent') userAgent: string | undefined) {
    return this.authService.login(body, UserAgentUtils.getUserAgentInfo(userAgent));
  }

  @Delete(':sessionId')
  @AuthRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Sign out from the specific session' })
  public delete(@ReqAccount() account: Account, @Param('sessionId', IdPipe) sessionId: number) {
    return this.authService.deleteSession(account.id, sessionId);
  }
}
