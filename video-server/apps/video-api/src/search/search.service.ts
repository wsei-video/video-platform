import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';

import { SearchQuery } from './search.dto';

@Injectable()
export class SearchService {
  public constructor(private readonly database: DatabaseService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public search(phrase: SearchQuery) {
    throw new Error('Method not implemented.');
  }
}
