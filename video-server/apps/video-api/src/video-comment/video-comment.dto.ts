import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IdTransform, PagedResponse } from '@video/lib/restful';
import { IsString } from 'class-validator';
import { CommentReactionDto } from '../reaction/reaction.dto';
import { AccountDto } from '../account/account.dto';

@ApiSchema({ name: 'VideoComment', description: 'Video comment details' })
export class VideoCommentDto {
  @ApiProperty({ description: 'Unique video comment identifier' })
  @Expose()
  @IdTransform()
  public id: string;

  @ApiProperty({ description: 'Video comment content' })
  @Expose()
  public content: string;

  @ApiProperty({ description: 'Video comment updated date' })
  @Expose()
  public updatedAt: Date | null;

  @ApiProperty({ description: 'Video comment creation date' })
  @Expose()
  public createdAt: Date;

  @ApiProperty({ description: 'Comment author' })
  @Type(() => AccountDto)
  @Expose()
  public user: AccountDto;

  @ApiProperty({ description: 'Video comment parent id' })
  @Expose()
  @IdTransform()
  public parentId: string | null;

  @ApiProperty({ type: [VideoCommentDto], description: 'Comment replies' })
  @Type(() => VideoCommentDto)
  @Expose()
  public replies: VideoCommentDto[];

  @ApiProperty({ type: [CommentReactionDto], description: 'Comment reactions' })
  @Type(() => CommentReactionDto)
  @Expose()
  public reactions: CommentReactionDto[];
}

@ApiSchema({ name: 'VideoCommentCreate', description: 'VideoComment create schema' })
export class VideoCommentCreateDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  public content: string;
}

@ApiSchema({ name: 'VideoCommentUpdate', description: 'VideoComment update schema' })
export class VideoCommentUpdateDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  public content: string;
}

@ApiSchema({ name: 'VideoComments', description: 'Paged video comment list' })
export class VideoCommentsDto extends PagedResponse<VideoCommentDto> {
  @ApiProperty({ type: [VideoCommentDto], description: 'Video comments' })
  @Type(() => VideoCommentDto)
  @Expose()
  public items!: VideoCommentDto[];
}
