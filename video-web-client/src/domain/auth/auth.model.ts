import type { Account } from '../account/account.model'
import type { Session } from './session.model'

export class Auth {
  constructor(
    public account: Account,
    public session: Session,
    public readonly accessToken: string,
  ) {}
}
