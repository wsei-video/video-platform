import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@video/lib/database';

@Injectable()
export class VideoCommentService {
  public constructor(private readonly database: DatabaseService) {}
}
