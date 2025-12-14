import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';

export const HELLO_SERVICE_NAME = Symbol('SERVICE_NAME');

@Controller({ version: '' })
export class HelloController {
  public constructor(@Inject(HELLO_SERVICE_NAME) private readonly serviceName: string) {}

  @Get('/')
  @ApiOperation({ summary: 'Get service information' })
  public hello() {
    return {
      service: this.serviceName,
    };
  }
}
