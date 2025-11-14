import { IncomingMessage, ServerResponse } from 'node:http';

import { Injectable } from '@nestjs/common';
import { S3Store } from '@tus/s3-store';
import { EVENTS, Server } from '@tus/server';

import { StorageConstants } from '@video/lib/storage/storage.constants';
import { StorageService } from '@video/lib/storage';

import { UploadPublishService } from './upload-publish.service';

/** Handles TUS (https://tus.io) file upload. */
@Injectable()
export class UploadResumableService {
  private readonly server: Server;

  public constructor(
    private readonly uploadPublishService: UploadPublishService,
    private readonly storageService: StorageService,
  ) {
    const store = new S3Store({
      s3ClientConfig: {
        ...this.storageService.clientConfig,
        bucket: StorageConstants.uploadsBucket,
      },
    });

    this.server = new Server({
      // This path must match the HTTP handler method path.
      path: '/upload/resumable',
      // Instruct TUS to upload incoming files directly to S3 storage.
      datastore: store,
    });

    this.attachEventListeners();
  }

  public async handleUpload(request: IncomingMessage, response: ServerResponse): Promise<void> {
    await this.server.handle(request, response);
  }

  private attachEventListeners(): void {
    this.server.on(EVENTS.POST_FINISH, (request, response, upload) => {
      void this.uploadPublishService.publish(upload.id);
    });
  }
}
