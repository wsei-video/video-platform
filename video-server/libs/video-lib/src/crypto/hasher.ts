import * as bcrypt from 'bcrypt';

export class Hasher {
  private static readonly saltRounds = 10;

  public static hash(text: string): Promise<string> {
    return bcrypt.hash(text, Hasher.saltRounds);
  }

  public static verify(text: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(text, hashed);
  }
}
