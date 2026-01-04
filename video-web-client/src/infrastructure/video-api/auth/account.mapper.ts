import type { AccountCreateCommand, AccountLoginCommand } from '@/domain/account/account.commands'
import { Account } from '@/domain/account/account.model'
import type { PaginatedList } from '@/domain/shared/types'

import type { AccountCreateDto, AccountDto, AccountsDto, AuthSessionCreateDto } from '../shared'

export class AccountMapper {
  public static toDto(model: Account): AccountDto {
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      createdAt: model.createdAt.toISOString(),
    }
  }
  public static toModel(dto: AccountDto): Account {
    return new Account(dto.id, dto.email, dto.name, new Date(dto.createdAt))
  }
  public static toLoginDto(c: AccountLoginCommand): AuthSessionCreateDto {
    return {
      email: c.email,
      password: c.password,
    }
  }
  public static toRegisterDto(c: AccountCreateCommand): AccountCreateDto {
    return {
      email: c.email,
      name: c.name,
      password: c.password,
    }
  }
  public static toPaginatedModel(dto: AccountsDto): PaginatedList<Account> {
    return {
      hasNext: dto.next,
      total: dto.total,
      items: dto.items.map((i) => AccountMapper.toModel(i)),
    }
  }
}
