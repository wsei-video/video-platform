import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Get, Headers, Post } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, Serialize } from '@video/lib/restful';
import { UserAgentUtils } from '@video/lib/utils';

import { AccountCreateDto, AccountDto } from './account.dto';
import { AuthDto } from '../auth/auth.dto';
import { AuthRequired } from '../auth/auth-required';
import { AuthService } from '../auth/auth.service';
import { ReqAccount } from '../auth/auth-request.context';

@Controller('account')
export class AccountController {
  public constructor(private readonly authService: AuthService) {}

  @Get()
  @AuthRequired()
  @Serialize(AccountDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get currently signed in account' })
  public auth(@ReqAccount() account: Account) {
    return account;
  }

  @Post()
  @Serialize(AuthDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'Create a new account' })
  public register(@Body(BodyValidator) body: AccountCreateDto, @Headers('user-agent') userAgent: string | undefined) {
    return this.authService.register(body, UserAgentUtils.getUserAgentInfo(userAgent));
  }
}
