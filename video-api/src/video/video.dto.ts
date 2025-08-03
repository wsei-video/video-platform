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
  @ApiProperty()
  duration: number;
  @ApiProperty()
  creator: VideoCreatorDto;
  @ApiProperty()
  uploadedDate: Date;
  @ApiProperty()
  views: number;
}
