import { ServerResponse } from 'http';

import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { StorageService } from '@video/lib/storage';

@Injectable()
export class CdnService {
  public constructor(private readonly storageService: StorageService) {}

  public async streamStorageFile(
    bucket: string,
    key: string,
    range: string | undefined,
    response: ServerResponse,
  ): Promise<void> {
    const object = await this.storageService.getObject(bucket, key, range);
    if (!object) throw new NotFoundException();

    const isPartialContent = !!object.headers['Content-Range'];

    response.statusCode = isPartialContent ? HttpStatus.PARTIAL_CONTENT : HttpStatus.OK;

    for (const [header, value] of Object.entries(object.headers)) {
      if (value) response.setHeader(header, value);
    }

    object.body.pipe(response);
  }
}
