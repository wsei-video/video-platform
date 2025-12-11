import { Id } from './id';
import { Crypto, CryptoDecryptionError } from '../crypto/crypto';

describe('Id', () => {
  test('Encrypt', () => {
    const id = new Id({ clear: 1 });
    expect(id.clear).toBe(1);
    expect(id.encrypted).toBe('-Y5OWS2exwnMaKM-RWHDVg');
  });

  test('Decrypt', () => {
    const id = new Id({ encrypted: '-Y5OWS2exwnMaKM-RWHDVg' });
    expect(id.clear).toBe(1);
    expect(id.encrypted).toBe('-Y5OWS2exwnMaKM-RWHDVg');
  });

  test('Malformed encrypted string', () => {
    expect(() => new Id({ encrypted: '' })).toThrow(CryptoDecryptionError);
    expect(() => new Id({ encrypted: 'invalid' })).toThrow(CryptoDecryptionError);
    expect(() => new Id({ encrypted: Crypto.encrypt('a') })).toThrow(CryptoDecryptionError);
  });
});
