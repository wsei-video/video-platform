import { Video } from '@video/lib/database/client';

export abstract class VideoEvent {
  public constructor(public readonly video: Video) {}
}

export class VideoCreatedEvent extends VideoEvent {
  public static readonly key = 'video.created';
}

export class VideoUpdatedEvent extends VideoEvent {
  public static readonly key = 'video.updated';
}

export class VideoDeletedEvent extends VideoEvent {
  public static readonly key = 'video.deleted';
}
