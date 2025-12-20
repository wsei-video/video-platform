import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { Id, IdTransform, IsId, PagedResponse, ToId } from '@video/lib/restful';

@ApiSchema({ name: 'Channel', description: 'Channel details' })
export class ChannelDto {
  @ApiProperty({ description: 'Unique channel identifier' })
  @IdTransform()
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Channel display name' })
  @Expose()
  public name: string;

  @ApiProperty({ description: 'Unique channel URL slug' })
  @Expose()
  public slug: string;

  @ApiProperty({ description: 'Account creation date' })
  @Expose()
  public createdAt: Date;
}

@ApiSchema({ name: 'Channels', description: 'Paged channel list' })
export class ChannelsDto extends PagedResponse<ChannelDto> {
  @ApiProperty({ type: [ChannelDto] })
  @Type(() => ChannelDto)
  @Expose()
  public items!: ChannelDto[];
}

@ApiSchema({ name: 'ChannelCreate', description: 'Channel create request schema' })
export class ChannelCreateDto {
  @ApiProperty({ description: 'Channel display name' })
  @IsString()
  @Length(1, 64)
  public name: string;

  @ApiProperty({ description: 'Unique channel URL slug' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_.-]+$/)
  @Length(1, 64)
  public slug: string;
}

@ApiSchema({ name: 'ChannelUpdate', description: 'Channel update request schema' })
export class ChannelUpdateDto extends PartialType(ChannelCreateDto) {}

@ApiSchema({ name: 'ChannelAccountCreate', description: 'Link the account with the channel' })
export class ChannelAccountCreateDto {
  @ApiProperty({ description: 'Unique channel identifier', type: 'string' })
  @IsId()
  @ToId()
  public accountId: Id;
}
