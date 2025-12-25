import { describe, test, beforeEach, afterEach } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import nock from 'nock';

import { TestingFixture } from './testing/fixture';
import { AdaptiveStream, AudioStream, MediaStreams, VideoStream } from '@video/lib/services';
import { NotFoundError } from '@video/lib/restful';

describe('Adaptive master playlist', () => {
  const audioStreams: AudioStream[] = [
    {
      id: '-Y5OWS2exwnMaKM-RWHDVg',
      format: 'hls',
      codec: { name: 'AAC', id: 'mp4a.40.2' },
      channels: 2,
      size: 132864,
      url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/audio/mp4a/playlist.m3u8',
    },
    {
      id: '-Y5OWS2exwnMaKM-RWHDVg',
      format: 'dash',
      codec: { name: 'AAC', id: 'mp4a.40.2' },
      channels: 2,
      size: 132864,
      url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/audio/mp4a/playlist.mpd',
    },
  ];

  const videoStreams: VideoStream[] = [
    {
      id: '-Y5OWS2exwnMaKM-RWHDVg',
      format: 'hls',
      codec: { name: 'H.264', id: 'avc1.4d001f' },
      width: 640,
      height: 360,
      framerate: 30,
      averageBitrate: 586748,
      peakBitrate: 821936,
      size: 168232953,
      url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/video/avc1_360p30/playlist.m3u8',
    },
    {
      id: '-Y5OWS2exwnMaKM-RWHDVg',
      format: 'dash',
      codec: { name: 'H.264', id: 'avc1.4d001f' },
      width: 640,
      height: 360,
      framerate: 30,
      averageBitrate: 586748,
      peakBitrate: 821936,
      size: 168232953,
      url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/video/avc1_360p30/playlist.mpd',
    },
  ];

  const adaptiveStreams: AdaptiveStream[] = [
    { format: 'hls', url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/master.m3u8' },
    { format: 'dash', url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/master.mpd' },
  ];

  let fixture: TestingFixture;

  beforeEach(async () => (fixture = await TestingFixture.create()));

  afterEach(() => fixture.destroy());

  test('HLS video not found', async () => {
    const scope = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.NOT_FOUND, new NotFoundError({ resource: 'Video' }).getResponse());

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.m3u8')
      .expect(HttpStatus.NOT_FOUND)
      .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Video' } });

    expect(scope.isDone()).toBe(true);
  });

  test('HLS no streams', async () => {
    const streams: MediaStreams = {
      adaptive: [],
      audio: [],
      video: [],
    };

    const scope = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.OK, streams);

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.m3u8')
      .expect(HttpStatus.NOT_FOUND)
      .expect({ error: 'NotFound', statusCode: 404 });

    expect(scope.isDone()).toBe(true);
  });

  test('HLS video only', async () => {
    const streams: MediaStreams = {
      video: videoStreams,
      audio: [],
      adaptive: adaptiveStreams,
    };

    const scope = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.OK, streams);

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.m3u8')
      .expect(HttpStatus.OK)
      .expect(
        '#EXTM3U\n' +
          '#EXT-X-VERSION:4\n' +
          '#EXT-X-INDEPENDENT-SEGMENTS\n' +
          '#EXT-X-STREAM-INF:BANDWIDTH=821936,AVERAGE-BANDWIDTH=586748,RESOLUTION=640x360,FRAME-RATE=30,CODECS="avc1.4d001f",\n' +
          'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/video/avc1_360p30/playlist.m3u8',
      );

    expect(scope.isDone()).toBe(true);
  });

  test('HLS video and audio', async () => {
    const streams: MediaStreams = {
      video: videoStreams,
      audio: audioStreams,
      adaptive: adaptiveStreams,
    };

    const scope = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.OK, streams);

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.m3u8')
      .expect(HttpStatus.OK)
      .expect(
        '#EXTM3U\n' +
          '#EXT-X-VERSION:4\n' +
          '#EXT-X-INDEPENDENT-SEGMENTS\n' +
          '#EXT-X-MEDIA:URI="http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/audio/mp4a/playlist.m3u8",TYPE=AUDIO,GROUP-ID="audio-0",NAME="Audio 0",DEFAULT=YES,AUTOSELECT=YES,CHANNELS="2"\n' +
          '#EXT-X-STREAM-INF:BANDWIDTH=821936,AVERAGE-BANDWIDTH=586748,RESOLUTION=640x360,FRAME-RATE=30,CODECS="avc1.4d001f",AUDIO="audio-0"\n' +
          'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/video/avc1_360p30/playlist.m3u8',
      );

    expect(scope.isDone()).toBe(true);
  });

  test('DASH video only', async () => {
    const streams: MediaStreams = {
      video: videoStreams,
      audio: [],
      adaptive: adaptiveStreams,
    };

    const scope = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.OK, streams);

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.mpd')
      .expect(HttpStatus.NOT_IMPLEMENTED)
      .expect({
        error: 'NotImplemented',
        reason: {
          format: 'dash',
        },
        statusCode: 501,
      });

    expect(scope.isDone()).toBe(true);
  });

  test('DASH video and audio', async () => {
    const streams: MediaStreams = {
      video: videoStreams,
      audio: audioStreams,
      adaptive: adaptiveStreams,
    };

    const scope = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.OK, streams);

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.mpd')
      .expect(HttpStatus.NOT_IMPLEMENTED)
      .expect({
        error: 'NotImplemented',
        reason: {
          format: 'dash',
        },
        statusCode: 501,
      });

    expect(scope.isDone()).toBe(true);
  });
});
