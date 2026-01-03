export abstract class DomainError extends Error {
  reason: Record<string, unknown> | undefined

  constructor(message: string, reason?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
    this.reason = reason
  }
}

// technical errors
export class NetworkError extends DomainError {
  constructor(originalError?: string, reason?: Record<string, unknown>) {
    super(`Connection error occured: ${originalError}`, reason)
  }
}

export class UnexpectedServerError extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super('Unexpected server error. Try again later', reason)
  }
}

export class UnexpectedError extends DomainError {
  constructor(context: string, reason?: Record<string, unknown>) {
    super(`${context}: Unexpected error occured`, reason)
  }
}

// business error
export class NotAuthenticatedError extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super('You have to be authenticated to perform this action', reason)
  }
}
export class BadRequest extends DomainError {
  constructor(reason?: Record<string, unknown>, msg: string = 'Wrong input data') {
    super(msg, reason)
  }
}
export class ForbiddenError extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super("You don't have permission to perform this actions", reason)
  }
}
export class NotFoundError extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super("We couldn't find requested resource", reason)
  }
}
export class ConflictError extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super('Resource already exists', reason)
  }
}
export class GoneError extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super('Your permissions have expired', reason)
  }
}

// business logic errors
export class NoChannelError extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super('You have to be assigned to channel to perform this action', reason)
  }
}

export class ThereIsExistingUploadForVideoAlready extends DomainError {
  constructor(reason?: Record<string, unknown>) {
    super('There is an upload in progress for this video already', reason)
  }
}
