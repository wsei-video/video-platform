import { IsInt, IsString } from 'class-validator';

import { EncryptedToken } from './encrypted-token';

class TestToken {
  @IsString()
  public message: string;

  @IsInt()
  public count: number;

  public constructor(value: TestToken) {
    Object.assign(this, value);
  }
}

describe('EncryptedToken', () => {
  test('Encrypt', () => {
    const token = new TestToken({ message: 'Hello', count: 2 });
    const encrypted = EncryptedToken.encrypt(token);
    expect(encrypted).toBe('bJdcRifsmlpLtteRwzuc7blgsizQXuoUHRolE1wJfCQ');
  });

  test('Decrypt', () => {
    const encrypted = 'bJdcRifsmlpLtteRwzuc7blgsizQXuoUHRolE1wJfCQ';
    const decrypted = EncryptedToken.decrypt(TestToken, encrypted);
    expect(decrypted).toBeInstanceOf(TestToken);
    expect(decrypted?.message).toBe('Hello');
    expect(decrypted?.count).toBe(2);
  });
});
