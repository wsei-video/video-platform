import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';

@Injectable()
export class VideoService {
  public constructor(private readonly database: DatabaseService) {}
}
