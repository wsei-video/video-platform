import * as crypto from 'crypto';

export class Crypto {
  private static readonly envKeysName = 'CRYPTO_KEY';
  private static readonly envKeysSeparator = ':';
  private static readonly envKeysEncoding: BufferEncoding = 'base64';
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly clearEncoding: BufferEncoding = 'utf8';
  private static readonly encryptedEncoding: BufferEncoding = 'base64url';

  public static encrypt(message: string): string {
    try {
      return this.performEncryption(message);
    } catch (error) {
      throw new CryptoEncryptionError(
        error && error instanceof Error && 'message' in error && typeof error.message === 'string'
          ? error.message
          : undefined,
      );
    }
  }

  public static decrypt(message: string): string {
    try {
      return this.performDecryption(message);
    } catch (error) {
      throw new CryptoDecryptionError(
        error && error instanceof Error && 'message' in error && typeof error.message === 'string'
          ? error.message
          : undefined,
      );
    }
  }

  public static async random(bytes: number, encoding: BufferEncoding = 'hex'): Promise<string> {
    return (await Crypto.randomBuffer(bytes)).toString(encoding);
  }

  public static sign(
    message: Buffer | string,
    secret: crypto.BinaryLike,
    algorithm: 'sha1' | 'sha256' = 'sha256',
    encoding: crypto.BinaryToTextEncoding = 'base64',
  ): string {
    return crypto.createHmac(algorithm, secret).update(message).digest(encoding);
  }

  public static verifySignature(message: Buffer | string, secret: string, signature: string): boolean {
    try {
      return crypto.timingSafeEqual(Buffer.from(Crypto.sign(message, secret)), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  private static async randomBuffer(bytes: number): Promise<Buffer> {
    try {
      return Crypto.cryptographicRandomBuffer(bytes);
    } catch {
      return Crypto.pseudoRandomBuffer(bytes);
    }
  }

  private static cryptographicRandomBuffer(bytes: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(bytes, (error, buffer) => (error ? reject(error) : resolve(buffer)));
    });
  }

  private static pseudoRandomBuffer(bytes: number): Buffer {
    const buffer = Buffer.alloc(bytes);
    for (let i = 0; i < bytes; i++) buffer[i] = Math.floor(Math.random() * 256);
    return buffer;
  }

  private static performEncryption(message: string): string {
    if (message.length === 0) return '';
    const cipher = this.createCipher();
    const encrypted =
      cipher.update(message, Crypto.clearEncoding, Crypto.encryptedEncoding) + cipher.final(Crypto.encryptedEncoding);
    return encrypted;
  }

  private static performDecryption(message: string): string {
    const decipher = this.createDecipher();
    const encrypted = Buffer.from(message, Crypto.encryptedEncoding);
    return decipher.update(encrypted, undefined, Crypto.clearEncoding) + decipher.final(Crypto.clearEncoding);
  }

  private static createCipher(): crypto.Cipher {
    const { key, iv } = Crypto.getKeyAndIvFromEnv();
    return crypto.createCipheriv(Crypto.algorithm, key, iv);
  }

  private static createDecipher(): crypto.Decipher {
    const { key, iv } = Crypto.getKeyAndIvFromEnv();
    return crypto.createDecipheriv(Crypto.algorithm, key, iv);
  }

  private static getKeyAndIvFromEnv(): CryptoKeyIv {
    const keys = process.env[Crypto.envKeysName];
    if (!keys) throw new CryptoInvalidConfigurationError();
    const [encodedKey, encodedIv] = keys.split(Crypto.envKeysSeparator);
    if (!encodedKey || !encodedIv) throw new CryptoInvalidConfigurationError();
    const [key, iv] = [encodedKey, encodedIv].map(encoded => Buffer.from(encoded, Crypto.envKeysEncoding));
    if (!key?.length || !iv?.length) throw new CryptoInvalidConfigurationError();
    return { key, iv };
  }
}

export class CryptoError extends Error {}

export class CryptoInvalidConfigurationError extends CryptoError {}

export class CryptoEncryptionError extends CryptoError {}

export class CryptoDecryptionError extends CryptoError {}

type CryptoKeyIv = { key: Buffer; iv: Buffer };
