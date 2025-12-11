import { ApiResponseNoStatusOptions } from '@nestjs/swagger';
import { applyDecorators, ClassSerializerInterceptor, SerializeOptions, Type, UseInterceptors } from '@nestjs/common';
import { Transform } from 'class-transformer';

import { Id } from './id';

type ResponseDecorator = (options?: ApiResponseNoStatusOptions) => MethodDecorator & ClassDecorator;

export const Serialize = (type: Type, response: ResponseDecorator) =>
  applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({ type, strategy: 'excludeAll' }),
    response({ type }),
  );

export const IdTransform = () =>
  Transform(({ value }) => (typeof value === 'number' ? Id.clear(value).encrypted : value), {
    toPlainOnly: true,
  });
