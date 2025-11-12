import type { Channel } from '../channel/channel.model'

export class Account {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public createdAt: Date,
    public channels: Channel[] = [],
  ) {}
}
