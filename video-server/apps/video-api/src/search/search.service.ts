import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';
import { MeiliSearchService } from '@video/lib/meili-search';

import { SearchQuery } from './search.dto';
import { VideoCommonService } from '../video/video-common.service';

@Injectable()
export class SearchService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly meiliSearch: MeiliSearchService,
    private readonly videoCommonService: VideoCommonService,
  ) {}

  public async search(query: SearchQuery) {
    const offset = (query.page - 1) * query.count;
    const searchResult = await this.meiliSearch.getVideoIndex().search(query.phrase, { limit: query.count, offset });
    const orderedIds = searchResult.hits.map(hit => hit.id);

    const unorderedVideos = await this.database.video.findMany({
      where: { id: { in: orderedIds } },
      include: { channel: true, thumbnail: true },
    });

    const videosById = new Map(unorderedVideos.map(v => [v.id, v]));
    const orderedVideos = orderedIds.map(id => videosById.get(id)).filter(video => video !== undefined);

    const total = searchResult.estimatedTotalHits;
    const next = total > offset + searchResult.hits.length;

    return {
      items: orderedVideos.map(video => ({
        ...video,
        thumbnail: this.videoCommonService.serializeThumbnailToImage(video.thumbnail),
      })),
      total,
      next,
    };
  }
}
