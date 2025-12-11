import { Hasher } from './hasher';

describe('Hasher', () => {
  test('Hash and verify', async () => {
    expect(await Hasher.verify('12345', await Hasher.hash('12345'))).toBe(true);
  });

  test('Fail verification for different inputs', async () => {
    expect(await Hasher.verify('11111', await Hasher.hash('22222'))).toBe(false);
  });

  test('Produce different hashes for the same input', async () => {
    const hash1 = await Hasher.hash('12345');
    const hash2 = await Hasher.hash('12345');
    expect(hash1).not.toBe(hash2);
  });
});
