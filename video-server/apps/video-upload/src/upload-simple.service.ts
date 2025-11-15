import { randomUUID } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';

import { StorageConstants, StorageService } from '@video/lib/storage';

import { UploadPublishService } from './upload-publish.service';

/** Handles multipart/form-data file upload. */
@Injectable()
export class UploadSimpleService {
  private readonly logger = new Logger(UploadSimpleService.name);

  public constructor(
    private readonly storageService: StorageService,
    private readonly uploadPublishService: UploadPublishService,
  ) {}

  public async handleUpload(file: Express.Multer.File): Promise<void> {
    this.logger.log(`Incoming simple file upload: '${file.originalname}' (${file.mimetype})`);
    const key = randomUUID();
    await this.storageService.upload(StorageConstants.uploadsBucket, key, file.buffer);
    await this.uploadPublishService.publish(key);
  }
}
