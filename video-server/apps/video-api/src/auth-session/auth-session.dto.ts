import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IdTransform, PagedResponse } from '@video/lib/restful';

import { IsEmail, IsString } from 'class-validator';

@ApiSchema({ name: 'AuthSession' })
export class AuthSessionDto {
  @ApiProperty({ type: 'string' })
  @IdTransform()
  @Expose()
  public id: number;

  @ApiProperty({ type: 'string', nullable: true })
  @Expose()
  public device: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @Expose()
  public browser: string | null;

  @ApiProperty()
  @Expose()
  public lastAccessAt: Date;

  @ApiProperty()
  @Expose()
  public createdAt: Date;
}

@ApiSchema({ name: 'AuthSessions' })
export class AuthSessionsDto extends PagedResponse<AuthSessionDto> {
  @ApiProperty({ type: [AuthSessionDto] })
  @Type(() => AuthSessionDto)
  @Expose()
  public items!: AuthSessionDto[];
}

@ApiSchema({ name: 'AuthSessionCreate' })
export class AuthSessionCreateDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
