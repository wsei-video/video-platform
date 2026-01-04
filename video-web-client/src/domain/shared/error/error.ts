export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

// technical errors
export class NetworkError extends DomainError {
  constructor(originalError?: string) {
    super(`Connection error occured: ${originalError}`)
  }
}

export class UnexpectedServerError extends DomainError {
  constructor() {
    super('Unexpected server error. Try again later')
  }
}

export class UnexpectedError extends DomainError {
  constructor(context: string) {
    super(`${context}: Unexpected error occured`)
  }
}

// business error
export class NotAuthenticatedError extends DomainError {
  constructor() {
    super('You have to be authenticated to perform this action')
  }
}
export class BadRequest extends DomainError {
  constructor(msg: string = 'Wrong input data') {
    super(msg)
  }
}
export class ForbiddenError extends DomainError {
  constructor() {
    super("You don't have permission to perform this actions")
  }
}
export class NotFoundError extends DomainError {
  constructor() {
    super("We couldn't find requested resource")
  }
}
export class ConflictError extends DomainError {
  constructor() {
    super('Resource already exists')
  }
}
export class GoneError extends DomainError {
  constructor() {
    super('Your permissions have expired')
  }
}

// business logic errors
export class NoChannelError extends DomainError {
  constructor() {
    super('You have to be assigned to channel to perform this action')
  }
}

export class ThereIsExistingUploadForVideoAlready extends DomainError {
  constructor() {
    super('There is an upload in progress for this video already')
  }
}
