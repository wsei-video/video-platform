import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { DatabaseService } from '@video/lib/database';
import { MeiliSearchService } from '@video/lib/meili-search';

import { VideoCreatedEvent, VideoDeletedEvent, VideoUpdatedEvent } from '../video/video.events';
import { Video } from '@video/lib/database/client';

@Injectable()
export class SearchHandler implements OnModuleInit {
  public constructor(
    private readonly database: DatabaseService,
    private readonly meiliSearch: MeiliSearchService,
  ) {}

  public async onModuleInit() {
    // Bad idea in production, just for testing purposes so old dev videos work in search.
    await this.reIndexVideos();
  }

  @OnEvent(VideoCreatedEvent.key)
  public async handleCreated(event: VideoCreatedEvent) {
    await this.indexVideo(event.video);
  }

  @OnEvent(VideoUpdatedEvent.key)
  public async handleUpdated(event: VideoUpdatedEvent) {
    await this.indexVideo(event.video);
  }

  @OnEvent(VideoDeletedEvent.key)
  public async handleDeleted(event: VideoDeletedEvent) {
    await this.meiliSearch.getVideoIndex().deleteDocument(event.video.id);
  }

  private async indexVideo(video: Video) {
    await this.meiliSearch.getVideoIndex().addDocuments([
      {
        id: video.id,
        title: video.title,
        description: video.description,
      },
    ]);
  }

  private async reIndexVideos() {
    const videos = await this.database.video.findMany();
    await Promise.all(videos.map(video => this.indexVideo(video)));
  }
}
