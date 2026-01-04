export interface PaginatedList<T> {
  items: T[]
  total: number
  hasNext: boolean
}

export type ErrorHandler = (error: unknown) => never

export type PaginationOptions = {
  page: number
  count: number
}
