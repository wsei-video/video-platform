import { Injectable, Logger } from '@nestjs/common';

import { StorageConstants, StorageService } from '@video/lib/storage';

import { UploadService } from './upload.service';

/** Handles multipart/form-data file upload. */
@Injectable()
export class UploadSimpleService extends UploadService {
  private readonly logger = new Logger(UploadSimpleService.name);

  public constructor(private readonly storageService: StorageService) {
    super();
  }

  public async handleUpload(file: Express.Multer.File, token: string): Promise<void> {
    this.verifyToken(token);
    this.logger.log(`Incoming simple file upload: '${file.originalname}' (${file.mimetype})`);
    await this.storageService.upload(StorageConstants.uploadsBucket, token, file.buffer);
    await this.completeUpload({
      key: token,
      originalFileName: file.originalname,
      originalFileSize: file.size,
    });
  }
}
