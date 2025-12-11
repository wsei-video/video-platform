import { ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

import { BadRequestError } from './error';

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
