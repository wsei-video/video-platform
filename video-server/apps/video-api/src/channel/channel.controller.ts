import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { BodyValidator, IdPipe, ListQuery, QueryValidator, Serialize } from '@video/lib/restful';

import { AccountsDto } from '../account/account.dto';
import { AuthRequired } from '../auth/auth-required';
import { ChannelAccountCreateDto, ChannelCreateDto, ChannelDto, ChannelsDto, ChannelUpdateDto } from './channel.dto';
import { ChannelService } from './channel.service';
import { ReqAccount } from '../auth/auth-request.context';
import { VideosDto } from '../video/video.dto';

@Controller()
export class ChannelController {
  public constructor(private readonly channelService: ChannelService) {}

  @Get('channels')
  @AuthRequired()
  @Serialize(ChannelsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List channels available for the account' })
  public list(@ReqAccount() account: Account, @Query(QueryValidator) query: ListQuery) {
    return this.channelService.listAccountChannels(account, query);
  }

  @Get('channels/:channelId')
  @Serialize(ChannelDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get channel details' })
  public find(@Param('channelId', IdPipe) channelId: number) {
    return this.channelService.find(channelId);
  }

  @Get('channels/:channelId/accounts')
  @AuthRequired()
  @Serialize(AccountsDto, ApiOkResponse)
  @ApiOperation({ summary: 'List of accounts that have access to the channel' })
  public accounts(
    @ReqAccount() account: Account,
    @Param('channelId', IdPipe) channelId: number,
    @Query(QueryValidator) query: ListQuery,
  ) {
    return this.channelService.listChannelAccounts(account, channelId, query);
  }

  @Post('channels/:channelId/accounts')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Link the account with the channel' })
  public linkChannelAccount(
    @ReqAccount() account: Account,
    @Param('channelId', IdPipe) channelId: number,
    @Body(BodyValidator) body: ChannelAccountCreateDto,
  ) {
    return this.channelService.linkChannelAccount(account, channelId, body);
  }

  @Delete('channels/:channelId/accounts/:accountId')
  @AuthRequired()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlink the account from the channel' })
  public revokeAccountAccess(
    @ReqAccount() account: Account,
    @Param('channelId', IdPipe) channelId: number,
    @Param('accountId', IdPipe) accountId: number,
  ) {
    return this.channelService.unlinkChannelAccount(account, channelId, accountId);
  }

  @Get('channels/:channelId/videos')
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'List of videos on the channel' })
  public videos(
    @ReqAccount() account: Account | null,
    @Param('channelId', IdPipe) channelId: number,
    @Query(QueryValidator) query: ListQuery,
  ) {
    return this.channelService.listChannelVideos(account, channelId, query);
  }

  @Post('channels')
  @AuthRequired()
  @Serialize(ChannelDto, ApiCreatedResponse)
  @ApiOperation({ summary: 'Create a new channel' })
  public create(@ReqAccount() account: Account, @Body(BodyValidator) body: ChannelCreateDto) {
    return this.channelService.createAccountChannel(account, body);
  }

  @Patch('channels/:channelId')
  @AuthRequired()
  @Serialize(ChannelDto, ApiOkResponse)
  @ApiOperation({ summary: 'Update channel details' })
  public update(
    @ReqAccount() account: Account,
    @Param('channelId', IdPipe) channelId: number,
    @Body(BodyValidator) body: ChannelUpdateDto,
  ) {
    return this.channelService.updateAccountChannel(account, channelId, body);
  }

  @Delete('channels/:channelId')
  @AuthRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the specific channel' })
  public delete(@ReqAccount() account: Account, @Param('channelId', IdPipe) channelId: number) {
    return this.channelService.deleteAccountChannel(account, channelId);
  }

  @Get('channel/slug/:channelSlug')
  @Serialize(ChannelDto, ApiOkResponse)
  @ApiOperation({ summary: 'Get channel details by URL slug' })
  public findBySlug(@Param('channelSlug') channelSlug: string) {
    return this.channelService.findBySlug(channelSlug);
  }
}
