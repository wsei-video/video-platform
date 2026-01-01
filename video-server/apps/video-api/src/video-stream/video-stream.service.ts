import { Injectable } from '@nestjs/common';

import { Account } from '@video/lib/database/client';
import { Config } from '@video/lib/config';
import { DatabaseService } from '@video/lib/database';
import { Id } from '@video/lib/restful';
import { MediaAdaptiveFormat } from '@video/lib/media';

import { AudioStreamCreateDto, MediaStreamsDto, VideoStreamCreateDto } from './video-stream.dto';

@Injectable()
export class VideoStreamService {
  public constructor(
    private readonly config: Config,
    private readonly database: DatabaseService,
  ) {}

  public async list(account: Account, videoId: number): Promise<MediaStreamsDto> {
    await this.database.video.findFirstOrThrow({ where: { id: videoId } });

    const encryptedVideoId = Id.clear(videoId).encrypted;
    const baseCdnUrl = `${this.config.video.cdnUrl}/media/${encryptedVideoId}`;

    const videoStreams = await this.database.videoStream.findMany({ where: { videoId } });
    const audioStreams = await this.database.audioStream.findMany({ where: { videoId } });

    return {
      video: videoStreams.flatMap(videoStream =>
        MediaAdaptiveFormat.Formats.map(format => ({
          averageBitrate: videoStream.averageBitrate,
          size: Number(videoStream.size),
          codec: {
            id: videoStream.codecId,
            name: videoStream.codecName,
          },
          format: format.name,
          framerate: videoStream.framerate,
          height: videoStream.height,
          peakBitrate: videoStream.peakBitrate,
          id: videoStream.id,
          url: `${baseCdnUrl}/video/${videoStream.stream}/playlist.${format.extension}`,
          width: videoStream.width,
        })),
      ),
      audio: audioStreams.flatMap(audioStream =>
        MediaAdaptiveFormat.Formats.map(format => ({
          size: Number(audioStream.size),
          channels: audioStream.channels,
          codec: {
            id: audioStream.codecId,
            name: audioStream.codecName,
          },
          format: format.name,
          id: audioStream.id,
          url: `${baseCdnUrl}/audio/${audioStream.stream}/playlist.${format.extension}`,
        })),
      ),
      adaptive:
        videoStreams.length > 0
          ? MediaAdaptiveFormat.Formats.map(format => ({
              format: format.name,
              url: `${baseCdnUrl}/master.${format.extension}`,
            }))
          : [],
    };
  }

  public async createVideoStream(videoId: number, body: VideoStreamCreateDto) {
    return this.database.videoStream.create({
      data: {
        averageBitrate: body.averageBitrate,
        codecId: body.codecId,
        codecName: body.codecName,
        framerate: body.framerate,
        height: body.height,
        peakBitrate: body.peakBitrate,
        size: body.size,
        stream: body.stream,
        videoId,
        width: body.width,
      },
    });
  }

  public createAudioStream(videoId: number, body: AudioStreamCreateDto) {
    return this.database.audioStream.create({
      data: {
        channels: body.channels,
        codecId: body.codecId,
        codecName: body.codecName,
        size: body.size,
        stream: body.stream,
        videoId,
      },
    });
  }
}
