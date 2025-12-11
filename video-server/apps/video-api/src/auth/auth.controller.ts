import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { Account, AuthSession } from '@video/lib/database/client';
import { BodyValidator, Serialize } from '@video/lib/restful';
import { UserAgentUtils } from '@video/lib/utils';

import { AuthDto, AuthCreateDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ReqAccount, ReqSession } from './auth-request.context';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(AuthDto, ApiOkResponse)
  public auth(@ReqAccount() account: Account, @ReqSession() session: AuthSession) {
    return this.authService.getCurrentAuth(account, session);
  }

  @Post()
  @Serialize(AuthDto, ApiCreatedResponse)
  public register(@Body(BodyValidator) body: AuthCreateDto, @Headers('user-agent') userAgent: string | undefined) {
    return this.authService.register(body, UserAgentUtils.getUserAgentInfo(userAgent));
  }

  @Delete()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public logout(@ReqSession() session: AuthSession) {
    return this.authService.logout(session);
  }
}
