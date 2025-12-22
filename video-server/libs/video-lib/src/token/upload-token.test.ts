import { Id } from '../restful';
import { UploadToken } from './upload-token';
import { mockDate } from '../testing';

describe('UploadToken', () => {
  let token: UploadToken;

  beforeEach(() => {
    token = new UploadToken({
      accountId: Id.clear(1),
      expiresAt: new Date('2025-10-01T12:00:00.000Z'),
      videoId: Id.clear(2),
    });
  });

  test('Encrypt and decrypt', () => {
    const encrypted = token.encrypt();
    const decrypted = UploadToken.decrypt(encrypted);
    expect(decrypted?.accountId.clear).toEqual(1);
    expect(decrypted?.expiresAt.toISOString()).toEqual('2025-10-01T12:00:00.000Z');
    expect(decrypted?.videoId.clear).toEqual(2);
  });

  test('Verify token expiration', () => {
    mockDate('2025-10-01T11:59:59.999Z');
    expect(token.hasExpired()).toBe(false);
    mockDate('2025-10-01T12:00:00.000Z');
    expect(token.hasExpired()).toBe(true);
  });
});
