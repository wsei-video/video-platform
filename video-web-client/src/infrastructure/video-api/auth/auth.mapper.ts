import { Auth } from '@/domain/auth/auth.model'

import { AccountMapper } from './account.mapper'
import type { AuthDto } from '../shared'
import { SessionMapper } from './session.mapper'

export class AuthMapper {
  public static toModel(dto: AuthDto): Auth {
    const accountModel = AccountMapper.toModel(dto.account)
    const sessionModel = SessionMapper.toModel(dto.session)
    return new Auth(accountModel, sessionModel, dto.accessToken)
  }
  public static toDto(model: Auth): AuthDto {
    const accountDto = AccountMapper.toDto(model.account)
    const sessionDto = SessionMapper.toDto(model.session)
    return {
      session: sessionDto,
      account: accountDto,
      accessToken: model.accessToken,
    }
  }
}
