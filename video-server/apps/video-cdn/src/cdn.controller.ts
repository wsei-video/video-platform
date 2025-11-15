import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

import { CdnService } from './cdn.service';

@Controller()
export class CdnController {
  constructor(private readonly cdnService: CdnService) {}

  @Get(':bucket/*key')
  public get(
    @Param('bucket') bucket: string,
    @Param('key') key: string[],
    @Headers('range') range: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    return this.cdnService.streamStorageFile(bucket, key.join('/'), range, res);
  }
}
