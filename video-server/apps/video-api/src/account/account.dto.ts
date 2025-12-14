import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IdTransform, PagedResponse } from '@video/lib/restful';

@ApiSchema({ name: 'Account', description: 'User account details' })
export class AccountDto {
  @ApiProperty({ type: 'string', description: 'Unique account identifier' })
  @IdTransform()
  @Expose()
  public id: number;

  @ApiProperty({ description: 'Unique account email address' })
  @Expose()
  public email: string;

  @ApiProperty({ description: 'Account display name' })
  @Expose()
  public name: string;

  @ApiProperty({ description: 'Account creation date' })
  @Expose()
  public createdAt: Date;
}

@ApiSchema({ name: 'Accounts', description: 'Paged account list' })
export class AccountsDto extends PagedResponse<AccountDto> {
  @ApiProperty({ type: [AccountDto] })
  @Type(() => AccountDto)
  @Expose()
  public items!: AccountDto[];
}

@ApiSchema({ name: 'AccountCreate', description: 'Account create request schema' })
export class AccountCreateDto {
  @ApiProperty({ description: 'Unique account email address' })
  @IsEmail()
  public email: string;

  @ApiProperty({ description: 'Account password' })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  public password: string;

  @ApiProperty({ description: 'Account display name' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  public name: string;
}
