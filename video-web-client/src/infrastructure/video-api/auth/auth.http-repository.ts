import type { AxiosInstance } from 'axios'

import type { Account, AccountCreateCommand, AccountLoginCommand } from '@/domain/account'
import type { Auth, AuthRepository, Session } from '@/domain/auth'
import type { PaginatedList } from '@/domain/shared/types'

import type { AccountDto, AuthDto, AuthSessionsDto } from '../shared'
import { AccountMapper } from './account.mapper'
import { AuthMapper } from './auth.mapper'
import { SessionMapper } from './session.mapper'

export class AuthHttpRepository implements AuthRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly baseUrl: string = '/v1',
  ) {}

  async login(c: AccountLoginCommand): Promise<Auth> {
    const dto = AccountMapper.toLoginDto(c)
    const res = await this.httpClient.post<AuthDto>(`${this.baseUrl}/auth/sessions`, dto)
    return AuthMapper.toModel(res.data)
  }
  async logout(): Promise<void> {
    return await this.httpClient.delete(`${this.baseUrl}/auth/session`)
  }
  async register(c: AccountCreateCommand): Promise<Auth> {
    const dto = AccountMapper.toRegisterDto(c)
    const res = await this.httpClient.post<AuthDto>(`${this.baseUrl}/account`, dto)
    return AuthMapper.toModel(res.data)
  }
  async getCurrentUser(): Promise<Account> {
    const res = await this.httpClient.get<AccountDto>(`${this.baseUrl}/account`)
    return AccountMapper.toModel(res.data)
  }
  async getCurrentSession(): Promise<Auth> {
    const res = await this.httpClient.get<AuthDto>(`${this.baseUrl}/auth`)
    return AuthMapper.toModel(res.data)
  }
  async listUserSessions(page: number, count: number): Promise<PaginatedList<Session>> {
    const res = await this.httpClient.get<AuthSessionsDto>(`${this.baseUrl}/auth/sessions`, {
      params: {
        page,
        count,
      },
    })
    return SessionMapper.toPaginatedModel(res.data)
  }
}
