import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IdTransform, PagedResponse } from '@video/lib/restful';
import { IsString } from 'class-validator';

@ApiSchema({ name: 'VideoReaction', description: 'Video reaction details' })
export class VideoReactionDto {
  @ApiProperty({ description: 'Unique video reaction identifier', type: 'string' })
  @Expose()
  @IdTransform()
  public id: number;

  @ApiProperty({ description: 'Reaction content (e.g., like, dislike)' })
  @Expose()
  public content: string;

  @ApiProperty({ description: 'Reaction creation date' })
  @Expose()
  public createdAt: Date;

  @ApiProperty({ description: 'User who created the reaction', type: 'string' })
  @Expose()
  @IdTransform()
  public userId: number;

  @ApiProperty({ description: 'Video the reaction belongs to', type: 'string' })
  @Expose()
  @IdTransform()
  public videoId: number;
}

@ApiSchema({ name: 'VideoReactionCreate', description: 'Video reaction create schema' })
export class VideoReactionCreateDto {
  @ApiProperty({ description: 'Reaction content (e.g., like, dislike)' })
  @IsString()
  public content: string;
}

@ApiSchema({ name: 'VideoReactions', description: 'Paged video reaction list' })
export class VideoReactionsDto extends PagedResponse<VideoReactionDto> {
  @ApiProperty({ type: [VideoReactionDto], description: 'Video reactions' })
  @Type(() => VideoReactionDto)
  @Expose()
  public items!: VideoReactionDto[];
}

@ApiSchema({ name: 'VideoCommentReaction', description: 'Video comment reaction details' })
export class VideoCommentReactionDto {
  @ApiProperty({ description: 'Unique comment reaction identifier' })
  @Expose()
  @IdTransform()
  public id: string;

  @ApiProperty({ description: 'Reaction content (e.g., like, dislike)' })
  @Expose()
  public content: string;

  @ApiProperty({ description: 'Reaction creation date' })
  @Expose()
  public createdAt: Date;

  @ApiProperty({ description: 'User who created the reaction' })
  @Expose()
  @IdTransform()
  public userId: string;

  @ApiProperty({ description: 'Comment the reaction belongs to' })
  @Expose()
  @IdTransform()
  public commentId: string;
}

@ApiSchema({ name: 'VideoCommentReactionCreate', description: 'Video comment reaction create schema' })
export class VideoCommentReactionCreateDto {
  @ApiProperty({ description: 'Reaction content (e.g., like, dislike)' })
  @IsString()
  public content: string;
}

@ApiSchema({ name: 'VideoCommentReactions', description: 'Paged comment reaction list' })
export class VideoCommentReactionsDto extends PagedResponse<VideoCommentReactionDto> {
  @ApiProperty({ type: [VideoCommentReactionDto], description: 'Comment reactions' })
  @Type(() => VideoCommentReactionDto)
  @Expose()
  public items!: VideoCommentReactionDto[];
}

@ApiSchema({ name: 'ReactionAggregate', description: 'Aggregated reaction details ' })
export class ReactionAggregateDto {
  @ApiProperty({ description: 'Reaction content (e.g., like, dislike)' })
  @Expose()
  public content: string;

  @ApiProperty({ description: 'Number of reactions of this type on the resource' })
  @Expose()
  public count: number;
}
