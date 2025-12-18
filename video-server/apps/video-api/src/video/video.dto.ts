import { ApiProperty, ApiSchema, OmitType, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { Id, IdTransform, IsId, PagedResponse, ToId } from '@video/lib/restful';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ChannelDto } from '../channel/channel.dto';
import { VideoReactionDto } from '../reaction/reaction.dto';

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

  @ApiProperty({ enum: VideoVisibility, enumName: 'VideoVisibility', description: 'Video visibility' })
  @Expose()
  public visibility: VideoVisibility;

  @ApiProperty({ enum: VideoStatus, enumName: 'VideoStatus', description: 'Processing status' })
  @Expose()
  public status: VideoStatus;

  @ApiProperty({ type: [VideoReactionDto], description: 'Video reactions' })
  @Type(() => VideoReactionDto)
  @Expose()
  public reactions: VideoReactionDto[];
}

@ApiSchema({ name: 'VideoCreate', description: 'Video create request schema' })
export class VideoCreateDto {
  @ApiProperty({ description: 'Channel that video is on' })
  @IsId()
  @ToId()
  public channelId: Id;

  @ApiProperty({ description: 'Video title' })
  @IsString()
  public title: string;

  @ApiProperty({ description: 'Video description' })
  @Expose()
  @IsString()
  @IsOptional()
  public description: string;

  @ApiProperty({ description: 'HLS stream URL' })
  @Expose()
  @IsString()
  @IsOptional()
  public hlsUrl: string;

  @ApiProperty({ description: 'Thumbnail URL' })
  @Expose()
  @IsString()
  @IsOptional()
  public thumbnail: string;

  @ApiProperty({ description: 'Video duration in seconds' })
  @Expose()
  @IsNumber()
  @IsOptional()
  public duration: number;

  @ApiProperty({ description: 'Video upload date' })
  @Expose()
  @IsOptional()
  public createdAt: Date;

  @ApiProperty({ description: 'View count' })
  @Expose()
  @IsNumber()
  @IsOptional()
  public views: number;

  @ApiProperty({ enum: VideoVisibility, enumName: 'VideoVisibility', description: 'Video visibility' })
  @Expose()
  @IsOptional()
  public visibility: VideoVisibility;

  @ApiProperty({ enum: VideoStatus, enumName: 'VideoStatus', description: 'Processing status' })
  @Expose()
  @IsOptional()
  public status: VideoStatus;
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
