import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IdTransform, PagedResponse } from '@video/lib/restful';

@ApiSchema({ name: 'VideoComment', description: 'Video comment details' })
export class VideoCommentDto {
  @ApiProperty({ description: 'Unique video comment identifier' })
  @Expose()
  @IdTransform()
  public id: string;

  @ApiProperty({ description: 'Video comment updated date' })
  @Expose()
  public updatedAt: Date | null;

  @ApiProperty({ description: 'Video comment creation date' })
  @Expose()
  public createdAt: Date;
}

@ApiSchema({ name: 'VideoComments', description: 'Paged video comment list' })
export class VideoCommentsDto extends PagedResponse<VideoCommentDto> {
  @ApiProperty({ type: [VideoCommentDto], description: 'Video comments' })
  @Type(() => VideoCommentDto)
  @Expose()
  public items!: VideoCommentDto[];
}
