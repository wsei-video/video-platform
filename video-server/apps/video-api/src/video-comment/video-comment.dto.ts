import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { IdTransform, PagedResponse } from '@video/lib/restful';

import { AccountDto } from '../account/account.dto';
import { ReactionAggregateDto, VideoCommentReactionDto } from '../reaction/reaction.dto';

export class VideoCommentBaseDto {
  @ApiProperty({ description: 'Unique comment identifier' })
  @Expose()
  @IdTransform()
  public id: string;

  @ApiProperty({ description: 'Comment content' })
  @Expose()
  public content: string;

  @ApiProperty({ description: 'Comment updated date', type: Date, nullable: true })
  @Expose()
  public updatedAt: Date | null;

  @ApiProperty({ description: 'Comment creation date' })
  @Expose()
  public createdAt: Date;

  @ApiProperty({ description: 'Comment video id', type: 'string', nullable: true })
  @Expose()
  @IdTransform()
  public videoId: string | null;

  @ApiProperty({ description: 'Comment author' })
  @Type(() => AccountDto)
  @Expose()
  public user: AccountDto;

  @ApiProperty({ type: [ReactionAggregateDto], description: 'Aggregated comment reactions' })
  @Type(() => ReactionAggregateDto)
  @Expose()
  public reactions: ReactionAggregateDto[];

  @ApiProperty({
    type: VideoCommentReactionDto,
    description: 'Video comment reaction of the current user',
    nullable: true,
  })
  @Type(() => VideoCommentReactionDto)
  @Expose()
  public userReaction: VideoCommentReactionDto | null;
}

@ApiSchema({ name: 'VideoComment', description: 'Video comment details' })
export class VideoCommentDto extends VideoCommentBaseDto {
  @ApiProperty({ description: 'Number of replies to the comment' })
  @Expose()
  public replyCount: number;
}

@ApiSchema({ name: 'VideoCommentCreate', description: 'VideoComment create schema' })
export class VideoCommentCreateDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  public content: string;
}

@ApiSchema({ name: 'VideoCommentUpdate', description: 'VideoComment update schema' })
export class VideoCommentUpdateDto extends PartialType(VideoCommentCreateDto) {}

@ApiSchema({ name: 'VideoComments', description: 'Paged video comment list' })
export class VideoCommentsDto extends PagedResponse<VideoCommentDto> {
  @ApiProperty({ type: [VideoCommentDto], description: 'Video comments' })
  @Type(() => VideoCommentDto)
  @Expose()
  public items!: VideoCommentDto[];
}

@ApiSchema({ name: 'VideoCommentReply', description: 'Video comment reply details' })
export class VideoCommentReplyDto extends VideoCommentBaseDto {
  @ApiProperty({ description: 'Video comment parent id', type: 'string', nullable: true })
  @Expose()
  @IdTransform()
  public commentId: string | null;
}

@ApiSchema({ name: 'VideoCommentReplyCreate', description: 'Video comment reply create schema' })
export class VideoCommentReplyCreateDto extends VideoCommentCreateDto {}

@ApiSchema({ name: 'VideoCommentReplyUpdate', description: 'Video comment reply update schema' })
export class VideoCommentReplyUpdateDto extends PartialType(VideoCommentReplyCreateDto) {}

@ApiSchema({ name: 'VideoCommentReplies', description: 'Paged video comment reply list' })
export class VideoCommentRepliesDto extends PagedResponse<VideoCommentReplyDto> {
  @ApiProperty({ type: [VideoCommentReplyDto], description: 'Video comment replies' })
  @Type(() => VideoCommentReplyDto)
  @Expose()
  public items!: VideoCommentReplyDto[];
}
