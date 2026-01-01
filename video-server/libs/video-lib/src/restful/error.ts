import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpError extends HttpException {
  public constructor(error: string, statusCode: number, reason?: Record<string, unknown>) {
    super({ error, statusCode, reason }, statusCode);
  }
}

export class BadRequestError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('BadRequest', HttpStatus.BAD_REQUEST, reason);
  }
}

export class UnauthorizedError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('Unauthorized', HttpStatus.UNAUTHORIZED, reason);
  }
}

export class ForbiddenError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('Forbidden', HttpStatus.FORBIDDEN, reason);
  }
}

export class NotFoundError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('NotFound', HttpStatus.NOT_FOUND, reason);
  }
}

export class ConflictError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('Conflict', HttpStatus.CONFLICT, reason);
  }
}

export class GoneError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('Gone', HttpStatus.GONE, reason);
  }
}
export class NotImplementedError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('NotImplemented', HttpStatus.NOT_IMPLEMENTED, reason);
  }
}

export class BadGatewayError extends HttpError {
  public constructor(reason?: Record<string, unknown>) {
    super('BadGateway', HttpStatus.BAD_GATEWAY, reason);
  }
}
