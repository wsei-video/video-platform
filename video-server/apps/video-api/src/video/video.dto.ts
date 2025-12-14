import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PagedResponse } from '@video/lib/restful';

@ApiSchema({ name: 'VideoReaction' })
export class VideoReactionDto {
  @ApiProperty()
  public emoji: string;

  @ApiProperty()
  public count: number;
}

@ApiSchema({ name: 'Creator' })
export class VideoCreatorDto {
  @ApiProperty()
  public nickname: string;

  @ApiProperty()
  public photoUrl: string;
}

@ApiSchema({ name: 'DeprecatedVideoComment' })
export class VideoCommentDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public creator: VideoCreatorDto;

  @ApiProperty()
  public postDate: Date;

  @ApiProperty()
  public content: string;
}

export enum VideoVisibility {
  Public = 'public',
  Private = 'private',
  Unlisted = 'unlisted',
}

@ApiSchema({ name: 'Video' })
export class VideoDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public hlsUrl: string;

  @ApiProperty()
  public thumbnail: string;

  @ApiProperty({ type: [VideoReactionDto] })
  public reactions: VideoReactionDto[];

  @ApiProperty({ type: [VideoCommentDto] })
  public comments: VideoCommentDto[];

  @ApiProperty()
  public duration: number;

  @ApiProperty()
  public creator: VideoCreatorDto;

  @ApiProperty()
  public uploadedDate: Date;

  @ApiProperty()
  public views: number;

  @ApiProperty({ enum: VideoVisibility, enumName: 'VideoVisibility' })
  public visibility: VideoVisibility;
}

@ApiSchema({ name: 'Videos' })
export class VideosDto extends PagedResponse<VideoDto> {
  @ApiProperty({ type: [VideoDto] })
  @Type(() => VideoDto)
  @Expose()
  public items!: VideoDto[];
}
