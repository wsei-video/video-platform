import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IdTransform, PagedResponse } from '@video/lib/restful';

import { IsEmail, IsString } from 'class-validator';

@ApiSchema({ name: 'AuthSession', description: 'Account authentication session details' })
export class AuthSessionDto {
  @ApiProperty({ type: 'string', description: 'Unique session identifier' })
  @IdTransform()
  @Expose()
  public id: number;

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Name and/or version of the device of system used for sign in',
  })
  @Expose()
  public device: string | null;

  @ApiProperty({ type: 'string', nullable: true, description: 'Name of the browser used for sign in' })
  @Expose()
  public browser: string | null;

  @ApiProperty({ description: 'Last time that the session was used to access the API endpoints' })
  @Expose()
  public lastAccessAt: Date;

  @ApiProperty({ description: 'Session creation date' })
  @Expose()
  public createdAt: Date;
}

@ApiSchema({ name: 'AuthSessions', description: 'Paged account authentication session list' })
export class AuthSessionsDto extends PagedResponse<AuthSessionDto> {
  @ApiProperty({ type: [AuthSessionDto], description: 'Account authentication session list' })
  @Type(() => AuthSessionDto)
  @Expose()
  public items!: AuthSessionDto[];
}

@ApiSchema({ name: 'AuthSessionCreate', description: 'Sign in schema' })
export class AuthSessionCreateDto {
  @ApiProperty({ description: 'Account email address' })
  @IsEmail()
  public email: string;

  @ApiProperty({ description: 'Account password' })
  @IsString()
  public password: string;
}
