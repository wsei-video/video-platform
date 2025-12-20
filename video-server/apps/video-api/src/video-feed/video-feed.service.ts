import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';
import { ListQuery } from '@video/lib/restful';

@Injectable()
export class VideoFeedService {
  public constructor(private readonly database: DatabaseService) {}

  public async getForYouVideos(query: ListQuery) {
    const videos = await this.database.video.findMany({
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    const total = await this.database.video.count();
    const next = total > (query.page - 1) * query.count + videos.length;
    return { items: videos, total, next };
  }

  public async getRecentlyUploadedVideos(query: ListQuery) {
    const videos = await this.database.video.findMany({
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    const total = await this.database.video.count();
    const next = total > (query.page - 1) * query.count + videos.length;
    return { items: videos, total, next };
  }

  public async getMostPopularVideos(query: ListQuery) {
    const videos = await this.database.video.findMany({
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    const total = await this.database.video.count();
    const next = total > (query.page - 1) * query.count + videos.length;
    return { items: videos, total, next };
  }

  public async getTrendingVideos(query: ListQuery) {
    const videos = await this.database.video.findMany({
      skip: (query.page - 1) * query.count,
      take: query.count,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    const total = await this.database.video.count();
    const next = total > (query.page - 1) * query.count + videos.length;
    return { items: videos, total, next };
  }
}
