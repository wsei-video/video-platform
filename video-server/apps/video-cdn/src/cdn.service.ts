import { ServerResponse } from 'http';

import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';

import { AudioStream, MediaStreams, Video, VideoStream } from '@video/lib/services';
import { BadGatewayError, NotFoundError, NotImplementedError } from '@video/lib/restful';
import { Config } from '@video/lib/config';
import { MediaAdaptiveFormat } from '@video/lib/media';
import { StorageConstants, StorageService } from '@video/lib/storage';

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
    if (format === MediaAdaptiveFormat.Dash) return this.generateDashManifest(videoId, videoStreams, audioStreams);

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

  private async generateDashManifest(
    videoId: string,
    videoStreams: VideoStream[],
    audioStreams: AudioStream[],
  ): Promise<string> {
    const video = await this.getVideo(videoId);

    let audioAdaptationSet = '';
    let videoAdaptationSet = '';

    if (audioStreams.length) {
      const audioRepresentations = audioStreams.map(
        stream => `<Representation
          id="${stream.name}"
          mimeType="audio/mp4"
          codecs="${stream.codec.id}"
          bandwidth="256000"
          audioSamplingRate="44100">
          <AudioChannelConfiguration
            schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011"
            value="${stream.channels}" />
          <SegmentTemplate
            timescale="1"
            initialization="audio/${stream.name}/init.mp4"
            media="audio/${stream.name}/segment_$Number%06d$.m4s"
            startNumber="0"
            duration="${StorageConstants.hlsSectionMaxDuration}">
          </SegmentTemplate>
        </Representation>`,
      );

      audioAdaptationSet = `<AdaptationSet
        id="0"
        contentType="audio"
        startWithSAP="1"
        segmentAlignment="true">
        ${audioRepresentations.join('\n')}
      </AdaptationSet>`;
    }

    if (videoStreams.length) {
      const videoRepresentations = videoStreams.map(
        stream => `<Representation
          id="${stream.name}"
          mimeType="video/mp4"
          codecs="${stream.codec.id}"
          bandwidth="${stream.averageBitrate}"
          width="${stream.width}"
          height="${stream.height}"
          frameRate="${stream.framerate}">
          <SegmentTemplate
            timescale="1"
            initialization="video/${stream.name}/init.mp4"
            media="video/${stream.name}/segment_$Number%06d$.m4s"
            startNumber="0"
            duration="${StorageConstants.hlsSegmentDuration}">
          </SegmentTemplate>
        </Representation>`,
      );

      videoAdaptationSet = `<AdaptationSet
        id="1"
        contentType="video"
        startWithSAP="1"
        segmentAlignment="true"
        bitstreamSwitching="true">
        ${videoRepresentations.join('\n')}
      </AdaptationSet>`;
    }

    return `<?xml version="1.0" encoding="utf-8"?>
      <MPD
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="urn:mpeg:dash:schema:mpd:2011"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xsi:schemaLocation="urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd"
        profiles="urn:mpeg:dash:profile:isoff-on-demand:2011"
        type="static"
        mediaPresentationDuration="PT${video.duration}S"
        maxSegmentDuration="PT${StorageConstants.hlsSegmentDuration}S"
        minBufferTime="PT2S">
        <Period id="0" start="PT0S">${audioAdaptationSet}
        ${videoAdaptationSet}
        </Period>
      </MPD>`;
  }

  private async getVideo(videoId: string): Promise<Video> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Video>(`${this.config.video.apiUrlInternal}/v1/videos/${videoId}`),
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new HttpException(error.response?.data, error.status ?? HttpStatus.BAD_GATEWAY);
      }
      throw new BadGatewayError(error);
    }
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
