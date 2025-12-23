import { IncomingMessage, ServerResponse } from 'node:http';

import { Injectable } from '@nestjs/common';
import { S3Store } from '@tus/s3-store';
import { EVENTS, Server } from '@tus/server';

import { BadRequestError } from '@video/lib/restful';
import { StorageConstants } from '@video/lib/storage/storage.constants';
import { StorageService } from '@video/lib/storage';

import { UploadService } from './upload.service';

/** Handles TUS (https://tus.io) file upload. */
@Injectable()
export class UploadResumableService extends UploadService {
  private readonly server: Server;

  public constructor(private readonly storageService: StorageService) {
    super();
    const store = new S3Store({
      s3ClientConfig: {
        ...this.storageService.clientConfig,
        bucket: StorageConstants.uploadsBucket,
      },
    });

    this.server = new Server({
      // This path must match the HTTP handler method path.
      path: '/v1/upload/video/resumable',
      // Instruct TUS to upload incoming files directly to S3 storage.
      datastore: store,
      generateUrl(request) {
        return request.url;
      },
      namingFunction(request) {
        const filename = request.url.split('/').pop();
        if (!filename) throw new BadRequestError();
        return filename;
      },
    });

    this.attachEventListeners();
  }

  public async handleUpload(request: IncomingMessage, response: ServerResponse, token: string): Promise<void> {
    this.verifyToken(token);
    await this.server.handle(request, response);
  }

  public async handleUploadChunk(request: IncomingMessage, response: ServerResponse): Promise<void> {
    await this.server.handle(request, response);
  }

  private attachEventListeners(): void {
    this.server.on(
      EVENTS.POST_FINISH,
      (request, response, upload) =>
        void this.completeUpload({
          key: upload.id,
          originalFileName: upload.metadata?.filename ?? '',
          originalFileSize: upload.size ?? 0,
        }),
    );
  }
}
