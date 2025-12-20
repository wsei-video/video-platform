import { ApiProperty, ApiSchema, OmitType, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { Id, IdTransform, IsId, PagedResponse, ToId } from '@video/lib/restful';

import { ChannelDto } from '../channel/channel.dto';
import { ReactionAggregateDto, VideoReactionDto } from '../reaction/reaction.dto';

export enum VideoVisibility {
  Public = 'public',
  Private = 'private',
  Unlisted = 'unlisted',
}

export enum VideoStatus {
  None = 'none',
  Processing = 'processing',
  Successful = 'successful',
  Failed = 'failed',
}

@ApiSchema({ name: 'Video' })
export class VideoDto {
  @ApiProperty({ description: 'Unique video identifier' })
  @IdTransform()
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Video title' })
  @Expose()
  public title: string;

  @ApiProperty({ description: 'Video description' })
  @Expose()
  public description: string;

  @ApiProperty({ description: 'HLS stream URL' })
  @Expose()
  public hlsUrl: string;

  @ApiProperty({ description: 'Thumbnail URL' })
  @Expose()
  public thumbnail: string;

  @ApiProperty({ description: 'Video duration in seconds' })
  @Expose()
  public duration: number;

  @ApiProperty({ type: ChannelDto, description: 'Channel that owns this video' })
  @Type(() => ChannelDto)
  @Expose()
  public channel: ChannelDto;

  @ApiProperty({ description: 'Video upload date' })
  @Expose()
  public createdAt: Date;

  @ApiProperty({ description: 'View count' })
  @Expose()
  public views: number;

  @ApiProperty({ description: 'Comment count' })
  @Expose()
  public commentCount: number;

  @ApiProperty({ enum: VideoVisibility, enumName: 'VideoVisibility', description: 'Video visibility' })
  @Expose()
  public visibility: VideoVisibility;

  @ApiProperty({ enum: VideoStatus, enumName: 'VideoStatus', description: 'Processing status' })
  @Expose()
  public status: VideoStatus;

  @ApiProperty({ type: [ReactionAggregateDto], description: 'Aggregated video reactions' })
  @Type(() => ReactionAggregateDto)
  @Expose()
  public reactions: ReactionAggregateDto[];

  @ApiProperty({ type: VideoReactionDto, description: 'Video reaction of the current user', nullable: true })
  @Type(() => VideoReactionDto)
  @Expose()
  public userReaction: VideoReactionDto | null;
}

@ApiSchema({ name: 'VideoCreate', description: 'Video create request schema' })
export class VideoCreateDto {
  @ApiProperty({ description: 'Channel that video is on', type: 'string' })
  @IsId()
  @ToId()
  public channelId: Id;

  @ApiProperty({ description: 'Video title' })
  @IsString()
  public title: string;

  @ApiProperty({ description: 'Video description', default: '' })
  @Expose()
  @IsString()
  @IsOptional()
  public description: string = '';

  @ApiProperty({
    enum: VideoVisibility,
    enumName: 'VideoVisibility',
    description: 'Video visibility',
    default: VideoVisibility.Public,
  })
  @Expose()
  @IsOptional()
  public visibility: VideoVisibility = VideoVisibility.Public;
}

@ApiSchema({ name: 'VideoUpdate', description: 'Video update request schema' })
export class VideoUpdateDto extends PartialType(OmitType(VideoCreateDto, ['channelId'])) {}

@ApiSchema({ name: 'Videos' })
export class VideosDto extends PagedResponse<VideoDto> {
  @ApiProperty({ type: [VideoDto] })
  @Type(() => VideoDto)
  @Expose()
  public items!: VideoDto[];
}
