export interface ChannelCreateCommand {
  name: string
  slug: string
}

export interface ChannelUpdateCommand {
  id: string
  name?: string
  slug?: string
}

export interface ChannelLinkCommand {
  id: string
  accountId: string
}
