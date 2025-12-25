import { ServerResponse } from 'http';

import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';

import { BadGatewayError, NotFoundError, NotImplementedError } from '@video/lib/restful';
import { Config } from '@video/lib/config';
import { MediaAdaptiveFormat } from '@video/lib/media';
import { AudioStream, MediaStreams, VideoStream } from '@video/lib/services';
import { StorageService } from '@video/lib/storage';

@Injectable()
export class CdnService {
  public constructor(
    private readonly config: Config,
    private readonly httpService: HttpService,
    private readonly storageService: StorageService,
  ) {}

  public async getMasterPlaylist(videoId: string, format: MediaAdaptiveFormat) {
    const mediaStreams = await this.getMediaStreams(videoId);
    const audioStreams = mediaStreams.audio.filter(stream => stream.format === format.name);
    const videoStreams = mediaStreams.video.filter(stream => stream.format === format.name);

    if (!videoStreams.length) throw new NotFoundError();

    if (format === MediaAdaptiveFormat.Hls) return this.generateHlsMasterPlaylist(videoStreams, audioStreams);

    throw new NotImplementedError({ format: format.name });
  }

  public async streamStorageFile(
    bucket: string,
    key: string,
    range: string | undefined,
    response: ServerResponse,
  ): Promise<void> {
    const object = await this.storageService.getObject(bucket, key, range);
    if (!object) throw new NotFoundException();

    const isPartialContent = !!object.headers['Content-Range'];

    response.statusCode = isPartialContent ? HttpStatus.PARTIAL_CONTENT : HttpStatus.OK;

    for (const [header, value] of Object.entries(object.headers)) {
      if (value) response.setHeader(header, value);
    }

    object.body.pipe(response);
  }

  private generateHlsMasterPlaylist(videoStreams: VideoStream[], audioStreams: AudioStream[]): string {
    const lines: string[] = ['#EXTM3U', '#EXT-X-VERSION:4', '#EXT-X-INDEPENDENT-SEGMENTS'];

    audioStreams.forEach((stream, index) => {
      const isDefault = index === 0 ? 'YES' : 'NO';
      const isAutoSelected = isDefault;

      lines.push(
        `#EXT-X-MEDIA:URI="${stream.url}",TYPE=AUDIO,GROUP-ID="audio-${index}",NAME="Audio ${index}",` +
          `DEFAULT=${isDefault},AUTOSELECT=${isAutoSelected},CHANNELS="${stream.channels}"`,
      );
    });

    videoStreams.forEach(stream => {
      const audio = audioStreams.length > 0 ? 'AUDIO="audio-0"' : '';

      lines.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${stream.peakBitrate},AVERAGE-BANDWIDTH=${stream.averageBitrate},` +
          `RESOLUTION=${stream.width}x${stream.height},FRAME-RATE=${stream.framerate},CODECS="${stream.codec.id}",` +
          audio,
      );
      lines.push(stream.url);
    });

    return lines.join('\n');
  }

  private async getMediaStreams(videoId: string): Promise<MediaStreams> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<MediaStreams>(`${this.config.video.apiUrlInternal}/v1/videos/${videoId}/streams`),
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new HttpException(error.response?.data, error.status ?? HttpStatus.BAD_GATEWAY);
      }
      throw new BadGatewayError(error);
    }
  }
}
