export interface ErrorReason {
  name: string
  issues: Record<string, string[]>
}
export abstract class DomainError extends Error {
  reason?: ErrorReason

  constructor(message: string, reason?: ErrorReason) {
    super(message)
    this.name = this.constructor.name
    this.reason = reason
  }
}

// technical errors
export class NetworkError extends DomainError {
  constructor(originalError?: string, reason?: ErrorReason) {
    super(`Connection error occured: ${originalError}`, reason)
  }
}

export class UnexpectedServerError extends DomainError {
  constructor(reason?: ErrorReason) {
    super('Unexpected server error. Try again later', reason)
  }
}

export class UnexpectedError extends DomainError {
  constructor(context: string, reason?: ErrorReason) {
    super(`${context}: Unexpected error occured`, reason)
  }
}

// business error
export class NotAuthenticatedError extends DomainError {
  constructor(reason?: ErrorReason) {
    super('You have to be authenticated to perform this action', reason)
  }
}
export class BadRequest extends DomainError {
  constructor(reason?: ErrorReason, msg: string = 'Wrong input data') {
    super(msg, reason)
  }
}
export class ForbiddenError extends DomainError {
  constructor(reason?: ErrorReason) {
    super("You don't have permission to perform this actions", reason)
  }
}
export class NotFoundError extends DomainError {
  constructor(reason?: ErrorReason) {
    super("We couldn't find requested resource", reason)
  }
}
export class ConflictError extends DomainError {
  constructor(reason?: ErrorReason) {
    super('Resource already exists', reason)
  }
}
export class GoneError extends DomainError {
  constructor(reason?: ErrorReason) {
    super('Your permissions have expired', reason)
  }
}

// business logic errors
export class NoChannelError extends DomainError {
  constructor(reason?: ErrorReason) {
    super('You have to be assigned to channel to perform this action', reason)
  }
}

export class ThereIsExistingUploadForVideoAlready extends DomainError {
  constructor(reason?: ErrorReason) {
    super('There is an upload in progress for this video already', reason)
  }
}

// Issues map
export const VALIDATION_ISSUES_MAP = {
  minLength: 'is too short',
  isEmail: 'Provided email is incorrect',
}
