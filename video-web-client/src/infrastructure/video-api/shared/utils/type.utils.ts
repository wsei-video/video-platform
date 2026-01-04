import type { UseQueryOptions } from '@tanstack/vue-query'

export const StaticImplements = <TStaticInterface>() => {
  return <TConstructor extends TStaticInterface>(constructor: TConstructor) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    constructor
  }
}

export type appUseQueryOptions<T> = Omit<UseQueryOptions<T | Error>, 'queryKey' | 'queryFn'>
