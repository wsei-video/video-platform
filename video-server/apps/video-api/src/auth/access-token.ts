import { IsInt } from 'class-validator';

import { EncryptedToken } from '@video/lib/crypto/encrypted-token';

export class AccessToken {
  @IsInt()
  public accountId: number;

  @IsInt()
  public sessionId: number;

  public constructor(value: { accountId: number; sessionId: number }) {
    Object.assign(this, value);
  }

  public static decrypt(token: string): AccessToken | null {
    return EncryptedToken.decrypt(AccessToken, token);
  }

  public encrypt(): string {
    return EncryptedToken.encrypt(this);
  }
}
