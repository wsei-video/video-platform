import { ApiProperty, ApiSchema, OmitType, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { Id, IdTransform, IsId, PagedResponse, ToId } from '@video/lib/restful';

import { AccountDto } from '../account/account.dto';
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

@ApiSchema({ name: 'VideoSource', description: 'Information about video source file' })
export class VideoSourceDto {
  @ApiProperty({ description: 'Name of the uploaded file' })
  @Expose()
  public name: string;

  @ApiProperty({ description: 'Size of the uploaded file in bytes' })
  @Expose()
  public size: number;

  @ApiProperty({ description: 'User that uploaded the file', nullable: true, type: AccountDto })
  @Type(() => AccountDto)
  @Expose()
  public user: AccountDto | null;

  @ApiProperty({ description: 'Uploaded file download URL' })
  @Expose()
  public url: string;
}

@ApiSchema({ name: 'VideoUploadSource', description: 'Object containing video upload URL' })
export class VideoUploadSourceDto {
  @ApiProperty({ description: 'Resumable video upload URL via multipart' })
  @Expose()
  public simpleUploadUrl: string;

  @ApiProperty({ description: 'Resumable video upload URL via TUS' })
  @Expose()
  public resumableUploadUrl: string;
}

@ApiSchema({ name: 'VideoSourceUpdate', description: 'Update information about video source file' })
export class VideoSourceUpdateDto {
  @ApiProperty({ description: 'Name of the uploaded file' })
  @IsString()
  public name: string;

  @ApiProperty({ description: 'Size of the uploaded file in bytes' })
  @IsInt()
  public size: number;

  @ApiProperty({ description: 'Id of user that uploaded the file', type: 'string' })
  @IsId()
  @ToId()
  public userId: Id;

  @ApiProperty({ description: 'Uploaded file key' })
  @IsString()
  public key: string;
}
