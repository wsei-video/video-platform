import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';

@Injectable()
export class VideoFeedService {
  public constructor(private readonly database: DatabaseService) {}

  public getForYouVideos() {
    throw new Error('Method not implemented.');
  }

  public getRecentlyUploadedVideos() {
    throw new Error('Method not implemented.');
  }

  public getMostPopularVideos() {
    throw new Error('Method not implemented.');
  }

  public getTrendingVideos() {
    throw new Error('Method not implemented.');
  }
}
