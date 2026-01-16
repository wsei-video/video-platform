import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';
import { MeiliSearchModule } from '@video/lib/meili-search';

import { SearchController } from './search.controller';
import { SearchHandler } from './search.handler';
import { SearchService } from './search.service';
import { VideoModule } from '../video/video.module';

@Module({
  controllers: [SearchController],
  imports: [DatabaseModule, VideoModule, MeiliSearchModule],
  providers: [SearchService, SearchHandler],
})
export class SearchModule {}
