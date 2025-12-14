import { APP_FILTER, BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, ClassProvider } from '@nestjs/common';

import { Prisma } from '../database/client';
import { BadRequestError, ConflictError, NotFoundError } from './error';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  public catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    if (exception.code === 'P2000') {
      // The provided value for the column is too long for the column's type
      return super.catch(new BadRequestError({ name: 'InvalidBody' }), host);
    }
    if (exception.code === 'P2002') {
      // Unique constraint failed
      const conflictingColumn = this.capitalizeFirstLetter(this.extractConflictingColumn(exception));
      const name = `${conflictingColumn}AlreadyExists`;
      return super.catch(new ConflictError({ name, resource: exception.meta?.modelName ?? undefined }), host);
    }
    if (exception.code === 'P2025') {
      // An operation failed because it depends on one or more records that were required but not found
      return super.catch(new NotFoundError({ resource: exception.meta?.modelName ?? undefined }), host);
    }
    super.catch(exception, host);
  }

  private extractConflictingColumn(exception: Prisma.PrismaClientKnownRequestError): string {
    // @ts-expect-error Private API
    const target = exception.meta.driverAdapterError.cause.constraint.fields;
    const column: string = Array.isArray(target) ? target[0] : '';
    // Multi-column keys formatting
    return column.replaceAll('"', '');
  }

  private capitalizeFirstLetter(text: string): string {
    if (text.length === 0) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

export const providePrismaClientExceptionFilter = (): ClassProvider<PrismaClientExceptionFilter> => ({
  provide: APP_FILTER,
  useClass: PrismaClientExceptionFilter,
});
