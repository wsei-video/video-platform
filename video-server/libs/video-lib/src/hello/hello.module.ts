import { DynamicModule, Module } from '@nestjs/common';

import { HELLO_SERVICE_NAME, HelloController } from './hello.controller';

@Module({})
export class HelloModule {
  public static forRoot(options: { serviceName: string }): DynamicModule {
    return {
      module: HelloModule,
      controllers: [HelloController],
      providers: [
        {
          provide: HELLO_SERVICE_NAME,
          useValue: options.serviceName,
        },
      ],
    };
  }
}
