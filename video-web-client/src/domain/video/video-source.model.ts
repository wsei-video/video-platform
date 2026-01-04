import type { Account } from '../account'

export class VideoSource {
  constructor(
    public name: string,
    public size: number,
    public url: string,
    public user: Account,
  ) {}
}
