import { Injectable, OnModuleInit } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

import { Config } from '../config';

@Injectable()
export class MeiliSearchService extends MeiliSearch implements OnModuleInit {
  public readonly indexVideo = 'videos';

  public constructor(config: Config) {
    super({ host: `${config.meiliSearch.host}:${config.meiliSearch.port}`, apiKey: config.meiliSearch.apiKey });
  }

  public async onModuleInit() {
    await this.configureVideoIndex();
  }

  public getVideoIndex() {
    return this.index<VideoIndex>(this.indexVideo);
  }

  private async configureVideoIndex() {
    const index = this.getVideoIndex();
    await index.updateSearchableAttributes(['title', 'description']);
    await index.updateFilterableAttributes(['id']);
  }
}

export interface VideoIndex {
  id: number;
  title: string;
  description: string;
}
