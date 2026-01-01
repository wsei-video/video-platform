import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@video/lib/config';
import { HelloModule } from '@video/lib/hello';
import { StorageModule } from '@video/lib/storage';

import { CdnController } from './cdn.controller';
import { CdnService } from './cdn.service';

@Module({
  imports: [HelloModule.forRoot({ serviceName: 'Video CDN Service' }), ConfigModule, HttpModule, StorageModule],
  controllers: [CdnController],
  providers: [CdnService],
})
export class CdnModule {}
