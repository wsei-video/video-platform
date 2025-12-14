import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';

import { QueryValidator, Serialize } from '@video/lib/restful';

import { SearchQuery } from './search.dto';
import { SearchService } from './search.service';
import { VideosDto } from '../video/video.dto';

@Controller('search')
export class SearchController {
  public constructor(private readonly searchService: SearchService) {}

  @Get()
  @Serialize(VideosDto, ApiOkResponse)
  @ApiOperation({ summary: 'Search content on the platform' })
  public search(@Query(QueryValidator) query: SearchQuery) {
    return this.searchService.search(query);
  }
}
