import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { MeiliSearchService } from './meili-search.service';

@Module({
  providers: [MeiliSearchService],
  exports: [MeiliSearchService],
  imports: [ConfigModule],
})
export class MeiliSearchModule {}
