import type {
  AccountCreateCommand,
  AccountLoginCommand,
  AccountUpdateCommand,
} from '../account/account.commands'
import type { Account } from '../account/account.model'
import type { PaginatedList } from '../shared/types'
import type { Auth } from './auth.model'
import type { Session } from './session.model'

export interface AuthRepository {
  login(c: AccountLoginCommand): Promise<Auth>
  logout(): Promise<void>
  register(c: AccountCreateCommand): Promise<Auth>
  update(c: AccountUpdateCommand): Promise<Account>
  getCurrentUser(): Promise<Account>
  getCurrentSession(): Promise<Auth>
  listUserSessions(page: number, count: number): Promise<PaginatedList<Session>>
}
