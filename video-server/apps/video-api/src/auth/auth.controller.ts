import { ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { Account, AuthSession } from '@video/lib/database/client';
import { Serialize } from '@video/lib/restful';

import { AuthDto } from './auth.dto';
import { AuthRequired } from './auth-required';
import { AuthService } from './auth.service';
import { ReqAccount, ReqSession } from './auth-request.context';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Get()
  @AuthRequired()
  @Serialize(AuthDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get currently signed in account and session' })
  public auth(@ReqAccount() account: Account, @ReqSession() session: AuthSession) {
    return this.authService.getCurrentAuth(account, session);
  }

  @Delete('session')
  @AuthRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Sign out from current session' })
  public logout(@ReqSession() session: AuthSession) {
    return this.authService.logout(session);
  }
}
