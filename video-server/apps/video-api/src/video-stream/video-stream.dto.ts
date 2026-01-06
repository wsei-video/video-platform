import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IdTransform } from '@video/lib/restful';
import { IsInt, IsString } from 'class-validator';

@ApiSchema({ name: 'VideoScrubberImage' })
export class VideoScrubberImageDto {
  @ApiProperty({ description: 'Frame width in pixels' })
  @Expose()
  public width: number;

  @ApiProperty({ description: 'Frame height in pixels' })
  @Expose()
  public height: number;

  @ApiProperty({ description: 'Number of frames in a row' })
  @Expose()
  public columns: number;

  @ApiProperty({ description: 'Number of frames in a column' })
  @Expose()
  public rows: number;

  @ApiProperty({ description: 'Duration in seconds for one frame to be displayed' })
  @Expose()
  public frameDuration: number;

  @ApiProperty({ description: 'Number of image files' })
  @Expose()
  public count: number;

  @ApiProperty({ description: 'List of URLs for each image file', type: [String] })
  @Expose()
  public urls: string[];
}

@ApiSchema({ name: 'VideoScrubberImageCreate' })
export class VideoScrubberImageCreateDto {
  @ApiProperty({ description: 'Frame width in pixels' })
  @IsInt()
  public width: number;

  @ApiProperty({ description: 'Frame height in pixels' })
  @IsInt()
  public height: number;

  @ApiProperty({ description: 'Number of frames in a row' })
  @IsInt()
  public columns: number;

  @ApiProperty({ description: 'Number of frames in a column' })
  @IsInt()
  public rows: number;

  @ApiProperty({ description: 'Duration in seconds for one frame to be displayed' })
  @IsInt()
  public frameDuration: number;

  @ApiProperty({ description: 'Number of image files' })
  @IsInt()
  public count: number;
}

@ApiSchema({ name: 'MediaCodec', description: 'Media codec information' })
export class MediaCodecDto {
  @ApiProperty({ description: 'Codec name' })
  @Expose()
  public name: string;

  @ApiProperty({ description: 'Codec identification in RFC 6381 format' })
  @Expose()
  public id: string;
}

@ApiSchema({ name: 'VideoStream', description: 'Video stream' })
export class VideoStreamDto {
  @ApiProperty({ description: 'Unique id of the video stream', type: 'string' })
  @IdTransform()
  @Expose()
  public id: number;

  @ApiProperty({ description: 'Video stream format' })
  @Expose()
  public format: string;

  @ApiProperty({ type: MediaCodecDto, description: 'Video stream codec' })
  @Type(() => MediaCodecDto)
  @Expose()
  public codec: MediaCodecDto;

  @ApiProperty({ description: 'Video stream width in pixels' })
  @Expose()
  public width: number;

  @ApiProperty({ description: 'Video stream height in pixels' })
  @Expose()
  public height: number;

  @ApiProperty({ description: 'Video stream frames per second' })
  @Expose()
  public framerate: number;

  @ApiProperty({ description: 'Video stream size in bytes' })
  @Expose()
  public size: number;

  @ApiProperty({ description: 'Average video stream bits per second' })
  @Expose()
  public averageBitrate: number;

  @ApiProperty({ description: 'Maximum instantaneous video stream bits per second' })
  @Expose()
  public peakBitrate: number;

  @ApiProperty({ description: 'Video stream manifest download URL' })
  @Expose()
  public url: string;
}

@ApiSchema({ name: 'AudioStream', description: 'Audio stream' })
export class AudioStreamDto {
  @ApiProperty({ description: 'Unique id of the audio stream', type: 'string' })
  @IdTransform()
  @Expose()
  public id: number;

  @ApiProperty({ description: 'Audio stream format' })
  @Expose()
  public format: string;

  @ApiProperty({ type: MediaCodecDto, description: 'Audio stream codec' })
  @Type(() => MediaCodecDto)
  @Expose()
  public codec: MediaCodecDto;

  @ApiProperty({ description: 'Audio stream channel count' })
  @Expose()
  public channels: number;

  @ApiProperty({ description: 'Audio stream size in bytes' })
  @Expose()
  public size: number;

  @ApiProperty({ description: 'Audio stream manifest download URL' })
  @Expose()
  public url: string;
}

@ApiSchema({ name: 'AdaptiveStream', description: 'Adaptive stream with video and audio combined' })
export class AdaptiveStreamDto {
  @ApiProperty({ description: 'Adaptive stream format' })
  @Expose()
  public format: string;

  @ApiProperty({ description: 'Adaptive stream manifest download URL' })
  @Expose()
  public url: string;
}

@ApiSchema({ name: 'VideoStreamCreate', description: 'Video stream create request schema' })
export class VideoStreamCreateDto {
  @ApiProperty({ description: 'Video stream codec name' })
  @IsString()
  public codecName: string;

  @ApiProperty({ description: 'Video stream codec identification in RFC 6381 format' })
  @IsString()
  public codecId: string;

  @ApiProperty({ description: 'Video stream name' })
  @IsString()
  public stream: string;

  @ApiProperty({ description: 'Video stream width' })
  @IsInt()
  public width: number;

  @ApiProperty({ description: 'Video stream height' })
  @IsInt()
  public height: number;

  @ApiProperty({ description: 'Video stream frames per second' })
  @IsInt()
  public framerate: number;

  @ApiProperty({ description: 'Video stream size in bytes' })
  @IsInt()
  public size: number;

  @ApiProperty({ description: 'Average video stream bits per second' })
  @IsInt()
  public averageBitrate: number;

  @ApiProperty({ description: 'Maximum instantaneous video stream bits per second' })
  @IsInt()
  public peakBitrate: number;
}

@ApiSchema({ name: 'AudioStreamCreate', description: 'Audio stream create request schema' })
export class AudioStreamCreateDto {
  @ApiProperty({ description: 'Audio stream codec name' })
  @IsString()
  public codecName: string;

  @ApiProperty({ description: 'Audio stream codec identification in RFC 6381 format' })
  @IsString()
  public codecId: string;

  @ApiProperty({ description: 'Audio stream name' })
  @IsString()
  public stream: string;

  @ApiProperty({ description: 'Audio stream channel count' })
  @IsInt()
  public channels: number;

  @ApiProperty({ description: 'Audio stream size in bytes' })
  @IsInt()
  public size: number;
}

@ApiSchema({ name: 'MediaStreams', description: 'Available media streams' })
export class MediaStreamsDto {
  @ApiProperty({ type: [VideoStreamDto], description: 'List of video streams' })
  @Type(() => VideoStreamDto)
  @Expose()
  public video: VideoStreamDto[];

  @ApiProperty({ type: [AudioStreamDto], description: 'List of audio streams' })
  @Type(() => AudioStreamDto)
  @Expose()
  public audio: AudioStreamDto[];

  @ApiProperty({ type: [AdaptiveStreamDto], description: 'List of adaptive streams' })
  @Type(() => AdaptiveStreamDto)
  @Expose()
  public adaptive: AdaptiveStreamDto[];

  @ApiProperty({ description: 'Video scrubber image', type: VideoScrubberImageDto, nullable: true })
  @Type(() => VideoScrubberImageDto)
  @Expose()
  public scrubber: VideoScrubberImageDto | null;
}
