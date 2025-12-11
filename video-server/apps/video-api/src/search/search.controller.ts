import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { SearchService } from './search.service';
import { VideoDto } from '../video/video.dto';

@Controller('search')
export class SearchController {
  public constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOkResponse({ type: [VideoDto] })
  public search(@Query('phrase') phrase: string) {
    return this.searchService.search(phrase);
  }
}
