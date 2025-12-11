import { Crypto, CryptoDecryptionError } from '../crypto/crypto';

export class Id {
  public readonly clear: number;
  public readonly encrypted: string;

  public constructor(options: IdOptions) {
    if ('clear' in options) {
      this.clear = options.clear;
      this.encrypted = this.encrypt();
    } else {
      this.encrypted = options.encrypted;
      this.clear = this.decrypt();
    }
  }

  public static clear(clear: number): Id {
    return new Id({ clear });
  }

  public static encrypted(encrypted: string): Id {
    return new Id({ encrypted });
  }

  private encrypt(): string {
    return Crypto.encrypt(this.clear.toString(10));
  }

  private decrypt(): number {
    const clear = Crypto.decrypt(this.encrypted);
    const number = parseInt(clear);
    if (isNaN(number)) throw new CryptoDecryptionError();
    return number;
  }
}

export type IdClear = { clear: number };

export type IdEncrypted = { encrypted: string };

export type IdOptions = IdClear | IdEncrypted;
