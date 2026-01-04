export interface AccountCreateCommand {
  email: string
  name: string
  password: string
}

export interface AccountLoginCommand {
  email: string
  password: string
}

export interface AccountUpdateCommand {
  id: string
  name: string
}
