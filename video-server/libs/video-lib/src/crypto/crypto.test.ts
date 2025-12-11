import { Crypto, CryptoDecryptionError } from './crypto';

describe('Crypto', () => {
  test('Encrypt empty string', () => {
    expect(Crypto.encrypt('')).toBe('');
  });

  test('Encrypt and decrypt', () => {
    const message = 'hello';
    const encrypted = Crypto.encrypt(message);
    expect(encrypted).toBe('VMttKEPL7yqIwODEJY2yGg');
    const decrypted = Crypto.decrypt(encrypted);
    expect(decrypted).toBe('hello');
  });

  test('Decrypt invalid message', () => {
    expect(() => Crypto.decrypt('')).toThrow(CryptoDecryptionError);
    expect(() => Crypto.decrypt('invalid')).toThrow(CryptoDecryptionError);
  });

  test('Sign and verify', () => {
    const message = 'hello';
    const secret = 'a3f9cbe4187d2a9e6c54b10fae76d4bc19e2f38c6d7b5a0c3f1e9b2847a6c5d1';
    const signature = Crypto.sign(message, secret);
    expect(Crypto.verifySignature(message, secret, signature)).toBe(true);

    const differentSecret = '4919ce2821c16d52e88949de26fe18af7d14de28c23e67b3fedc49b4766010e0';
    expect(Crypto.verifySignature(message, differentSecret, signature)).toBe(false);
  });
});
