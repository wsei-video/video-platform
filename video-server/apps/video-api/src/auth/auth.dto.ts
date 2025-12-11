import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { IdTransform } from '@video/lib/restful';

import { AuthSessionDto } from '../auth-session/auth-session.dto';

@ApiSchema({ name: 'Account' })
export class AccountDto {
  @ApiProperty({ type: 'string' })
  @IdTransform()
  @Expose()
  public id: number;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Expose()
  public createdAt: Date;
}

@ApiSchema({ name: 'Auth' })
export class AuthDto {
  @ApiProperty()
  @Type(() => AccountDto)
  @Expose()
  public account: AccountDto;

  @ApiProperty()
  @Type(() => AuthSessionDto)
  @Expose()
  public session: AuthSessionDto;

  @ApiProperty()
  @Expose()
  public accessToken: string;
}

@ApiSchema({ name: 'AuthCreate' })
export class AuthCreateDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  public password: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  public name: string;
}
