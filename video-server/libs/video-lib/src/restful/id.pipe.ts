import { PipeTransform, Injectable } from '@nestjs/common';

import { BadRequestError } from './error';
import { Id } from './id';

@Injectable()
export class IdPipe implements PipeTransform {
  public transform(value: string) {
    try {
      return Id.encrypted(value).clear;
    } catch {
      throw new BadRequestError({ name: 'InvalidId' });
    }
  }
}
