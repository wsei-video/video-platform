import { Controller, Get, Inject } from '@nestjs/common';

export const HELLO_SERVICE_NAME = Symbol('SERVICE_NAME');

@Controller({ version: '' })
export class HelloController {
  public constructor(@Inject(HELLO_SERVICE_NAME) private readonly serviceName: string) {}

  @Get('/')
  public hello() {
    return {
      service: this.serviceName,
    };
  }
}
