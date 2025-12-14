import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { AccountDto } from '../account/account.dto';
import { AuthSessionDto } from '../auth-session/auth-session.dto';

@ApiSchema({ name: 'Auth', description: 'Currently signed in account session' })
export class AuthDto {
  @ApiProperty({ description: 'Current authenticated account' })
  @Type(() => AccountDto)
  @Expose()
  public account: AccountDto;

  @ApiProperty({ description: 'Current authenticated user session' })
  @Type(() => AuthSessionDto)
  @Expose()
  public session: AuthSessionDto;

  @ApiProperty({ description: 'Access token for API endpoints' })
  @Expose()
  public accessToken: string;
}
