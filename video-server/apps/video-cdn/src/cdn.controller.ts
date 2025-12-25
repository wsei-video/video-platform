import { Controller, Get, Header, Headers, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

import { MediaAdaptiveFormat } from '@video/lib/media';

import { CdnService } from './cdn.service';

@Controller()
export class CdnController {
  constructor(private readonly cdnService: CdnService) {}

  @Get(`media/:videoId/master.${MediaAdaptiveFormat.Hls.extension}`)
  @Header('Content-Type', 'application/vnd.apple.mpegurl')
  public getHlsMasterPlaylist(@Param('videoId') videoId: string) {
    return this.cdnService.getMasterPlaylist(videoId, MediaAdaptiveFormat.Hls);
  }

  @Get(`media/:videoId/master.${MediaAdaptiveFormat.Dash.extension}`)
  @Header('Content-Type', 'application/dash+xml')
  public getDashMasterPlaylist(@Param('videoId') videoId: string) {
    return this.cdnService.getMasterPlaylist(videoId, MediaAdaptiveFormat.Dash);
  }

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
