import { DomainError, UnexpectedError } from './error'

export async function handleError<T>(context: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action()
  } catch (e: unknown) {
    if (!(e instanceof DomainError)) throw new UnexpectedError(context)
    throw new Error(`${context}: ${e.message}`)
  }
}

export function getReason(e: unknown): Record<string, unknown> | undefined {
  if (!(e instanceof DomainError)) return undefined
  if (!e.reason) return undefined

  return e.reason
}
