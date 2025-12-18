import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IdTransform, PagedResponse } from '@video/lib/restful';
import { IsString } from 'class-validator';

@ApiSchema({ name: 'VideoReaction', description: 'Video reaction details' })
export class VideoReactionDto {
  @ApiProperty({ description: 'Unique video reaction identifier' })
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

  @ApiProperty({ description: 'Video the reaction belongs to' })
  @Expose()
  @IdTransform()
  public videoId: string;
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

@ApiSchema({ name: 'CommentReaction', description: 'Comment reaction details' })
export class CommentReactionDto {
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

@ApiSchema({ name: 'CommentReactionCreate', description: 'Comment reaction create schema' })
export class CommentReactionCreateDto {
  @ApiProperty({ description: 'Reaction content (e.g., like, dislike)' })
  @IsString()
  public content: string;
}

@ApiSchema({ name: 'CommentReactions', description: 'Paged comment reaction list' })
export class CommentReactionsDto extends PagedResponse<CommentReactionDto> {
  @ApiProperty({ type: [CommentReactionDto], description: 'Comment reactions' })
  @Type(() => CommentReactionDto)
  @Expose()
  public items!: CommentReactionDto[];
}
