import { Type } from 'class-transformer';
import { IsDate, IsISO8601 } from 'class-validator';

import { Id, IsId, ToId } from '../restful';
import { EncryptedToken } from './encrypted-token';
import { DateUtils } from '../utils';

export class UploadToken {
  public static readonly DefaultTokenExpiresIn = 1000 * 60; // 1 minute

  @IsDate()
  @IsISO8601()
  @Type(() => Date)
  public expiresAt: Date;

  @IsId()
  @ToId()
  public accountId: Id;

  @IsId()
  @ToId()
  public videoId: Id;

  public constructor(value: { expiresAt: Date; accountId: Id; videoId: Id }) {
    Object.assign(this, value);
  }

  public static decrypt(token: string): UploadToken | null {
    return EncryptedToken.decrypt(UploadToken, token);
  }

  public encrypt(): string {
    return EncryptedToken.encrypt(this);
  }

  public hasExpired(): boolean {
    return DateUtils.now() >= this.expiresAt;
  }

  public toJSON() {
    return {
      accountId: this.accountId.clear,
      expiresAt: this.expiresAt,
      videoId: this.videoId.clear,
    };
  }
}
