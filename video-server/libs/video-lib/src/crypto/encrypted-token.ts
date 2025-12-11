import { ClassConstructor, plainToClass } from 'class-transformer';

import { Crypto } from './crypto';

export class EncryptedToken {
  public static encrypt(value: object): string {
    return Crypto.encrypt(JSON.stringify(value));
  }

  public static decrypt<TSchema>(schema: ClassConstructor<TSchema>, token: string): TSchema | null {
    try {
      const decrypted = JSON.parse(Crypto.decrypt(token));
      return plainToClass(schema, decrypted);
    } catch {
      return null;
    }
  }
}
