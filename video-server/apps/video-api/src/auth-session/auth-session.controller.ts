import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';
import { UserAgentUtils } from '@video/lib/utils';

import { AuthDto } from '../auth/auth.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthSessionDto, AuthSessionCreateDto, AuthSessionsDto } from './auth-session.dto';
import { AuthService } from '../auth/auth.service';
import { ReqAccount } from '../auth/auth-request.context';

@Controller('auth/sessions')
export class AuthSessionController {
  public constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(AuthSessionsDto, ApiOkResponse)
  public list(@ReqAccount() account: Account, @Query(QueryValidator) query: ListQuery) {
    return this.authService.listSessions(account.id, query);
  }

  @Get(':sessionId')
  @UseGuards(AuthGuard)
  @Serialize(AuthSessionDto, ApiOkResponse)
  public find(@ReqAccount() account: Account, @Param('sessionId', IdPipe) sessionId: number) {
    return this.authService.findSession(account.id, sessionId);
  }

  @Post()
  @Serialize(AuthDto, ApiCreatedResponse)
  public create(@Body(BodyValidator) body: AuthSessionCreateDto, @Headers('user-agent') userAgent: string | undefined) {
    return this.authService.login(body, UserAgentUtils.getUserAgentInfo(userAgent));
  }

  @Delete(':sessionId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public delete(@ReqAccount() account: Account, @Param('sessionId', IdPipe) sessionId: number) {
    return this.authService.deleteSession(account.id, sessionId);
  }
}
