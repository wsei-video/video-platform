import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'VideoReaction' })
export class VideoReactionDto {
  @ApiProperty()
  emoji: string;
  @ApiProperty()
  count: number;
}

@ApiSchema({ name: 'Creator' })
export class VideoCreatorDto {
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  photoUrl: string;
}

@ApiSchema({ name: 'VideoComment' })
export class VideoCommentDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  creator: VideoCreatorDto;
  @ApiProperty()
  postDate: Date;
  @ApiProperty()
  content: string;
}

export enum VideoVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@ApiSchema({ name: 'Video' })
export class VideoResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  hlsUrl: string;
  @ApiProperty()
  thumbnail: string;
  @ApiProperty({ type: [VideoReactionDto] })
  reactions: VideoReactionDto[];
  @ApiProperty({ type: [VideoCommentDto] })
  comments: VideoCommentDto[];
  @ApiProperty()
  duration: number;
  @ApiProperty()
  creator: VideoCreatorDto;
  @ApiProperty()
  uploadedDate: Date;
  @ApiProperty()
  views: number;
  @ApiProperty({ enum: VideoVisibility, enumName: 'VideoVisibility' })
  visibility: VideoVisibility;
}
