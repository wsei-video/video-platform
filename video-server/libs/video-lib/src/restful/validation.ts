import { registerDecorator, ValidationOptions } from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

import { BadRequestError } from './error';
import { Id } from './id';

const commonOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
};

const createExceptionFactory = (name: string) => (errors: ValidationError[]) => {
  return new BadRequestError({
    name: name,
    issues: Object.fromEntries(
      errors.map(error => {
        return [
          error.property,
          Object.entries(error.constraints ?? {}).map(([code]) => {
            return code;
          }),
        ];
      }),
    ),
  });
};

export const BodyValidator = new ValidationPipe({
  ...commonOptions,
  exceptionFactory: createExceptionFactory('InvalidBody'),
});

export const QueryValidator = new ValidationPipe({
  ...commonOptions,
  exceptionFactory: createExceptionFactory('InvalidQuery'),
});

export const ToId = (): PropertyDecorator =>
  Transform(({ value }) => {
    if (!value || typeof value !== 'string') return value;

    try {
      return Id.encrypted(value);
    } catch {
      return value;
    }
  });

export const IsId = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown): boolean => {
          return !!value && value instanceof Id;
        },
      },
    });
  };
};
