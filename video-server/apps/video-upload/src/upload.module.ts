import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';

import { ConfigModule } from '@video/lib/config';
import { HelloModule } from '@video/lib/hello';
import { QueueModule } from '@video/lib/queue';
import { StorageConstants, StorageModule, StorageService } from '@video/lib/storage';

import { UploadController } from './upload.controller';
import { UploadResumableService } from './upload-resumable.service';
import { UploadSimpleService } from './upload-simple.service';

@Module({
  imports: [
    ConfigModule,
    HelloModule.forRoot({ serviceName: 'Video Upload Service' }),
    HttpModule,
    QueueModule,
    StorageModule,
  ],
  controllers: [UploadController],
  providers: [UploadResumableService, UploadSimpleService],
})
export class UploadModule implements OnModuleInit {
  public constructor(private readonly storageService: StorageService) {}

  public async onModuleInit(): Promise<void> {
    await this.createPlatformStorageBuckets();
  }

  /** Creates S3 buckets required for the Video Platform. */
  private async createPlatformStorageBuckets(): Promise<void> {
    await this.storageService.createBucketIfNotExists(StorageConstants.uploadsBucket);
    await this.storageService.createBucketIfNotExists(StorageConstants.mediaBucket);
  }
}
