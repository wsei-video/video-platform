import { AxiosError } from 'axios'

import {
  BadRequest,
  ConflictError,
  DomainError,
  ForbiddenError,
  GoneError,
  NotFoundError,
  UnexpectedServerError,
} from '@/domain/shared/error/error'

export function handleError(error: unknown): never {
  if (error instanceof DomainError) {
    throw error
  }

  if (error instanceof AxiosError && error.response) {
    const status = error.response.data.statusCode
    switch (status) {
      case 410:
        throw new GoneError()
      case 409:
        throw new ConflictError()
      case 404:
        throw new NotFoundError()
      case 403:
        throw new ForbiddenError()
      case 400:
        throw new BadRequest()
    }
  }

  throw new UnexpectedServerError()
}
