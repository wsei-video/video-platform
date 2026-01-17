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
      name: 'mp4a',
    },
    {
      id: '-Y5OWS2exwnMaKM-RWHDVg',
      format: 'dash',
      codec: { name: 'AAC', id: 'mp4a.40.2' },
      channels: 2,
      size: 132864,
      url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/audio/mp4a/playlist.mpd',
      name: 'mp4a',
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
      name: 'avc1_360p30',
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
      name: 'avc1_360p30',
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
      scrubber: null,
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
      scrubber: null,
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
      scrubber: null,
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
      scrubber: null,
    };

    const scope1 = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg')
      .reply(HttpStatus.OK, { duration: 30 });

    const scope2 = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.OK, streams);

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.mpd')
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.text).toBe(`<?xml version="1.0" encoding="utf-8"?>
      <MPD
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="urn:mpeg:dash:schema:mpd:2011"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xsi:schemaLocation="urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd"
        profiles="urn:mpeg:dash:profile:isoff-on-demand:2011"
        type="static"
        mediaPresentationDuration="PT30S"
        maxSegmentDuration="PT6S"
        minBufferTime="PT2S">
        <Period id="0" start="PT0S">
        <AdaptationSet
        id="1"
        contentType="video"
        startWithSAP="1"
        segmentAlignment="true"
        bitstreamSwitching="true">
        <Representation
          id="avc1_360p30"
          mimeType="video/mp4"
          codecs="avc1.4d001f"
          bandwidth="586748"
          width="640"
          height="360"
          frameRate="30">
          <SegmentTemplate
            timescale="1"
            initialization="video/avc1_360p30/init.mp4"
            media="video/avc1_360p30/segment_$Number%06d$.m4s"
            startNumber="0"
            duration="6">
          </SegmentTemplate>
        </Representation>
      </AdaptationSet>
        </Period>
      </MPD>`);
      });

    expect(scope1.isDone()).toBe(true);
    expect(scope2.isDone()).toBe(true);
  });

  test('DASH video and audio', async () => {
    const streams: MediaStreams = {
      video: videoStreams,
      audio: audioStreams,
      adaptive: adaptiveStreams,
      scrubber: null,
    };

    const scope1 = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg')
      .reply(HttpStatus.OK, { duration: 30 });

    const scope2 = nock('http://api.video.internal')
      .get('/v1/videos/-Y5OWS2exwnMaKM-RWHDVg/streams')
      .reply(HttpStatus.OK, streams);

    await fixture
      .request()
      .get('/media/-Y5OWS2exwnMaKM-RWHDVg/master.mpd')
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.text).toBe(`<?xml version="1.0" encoding="utf-8"?>
      <MPD
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="urn:mpeg:dash:schema:mpd:2011"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xsi:schemaLocation="urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd"
        profiles="urn:mpeg:dash:profile:isoff-on-demand:2011"
        type="static"
        mediaPresentationDuration="PT30S"
        maxSegmentDuration="PT6S"
        minBufferTime="PT2S">
        <Period id="0" start="PT0S"><AdaptationSet
        id="0"
        contentType="audio"
        startWithSAP="1"
        segmentAlignment="true">
        <Representation
          id="mp4a"
          mimeType="audio/mp4"
          codecs="mp4a.40.2"
          bandwidth="256000"
          audioSamplingRate="44100">
          <AudioChannelConfiguration
            schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011"
            value="2" />
          <SegmentTemplate
            timescale="1"
            initialization="audio/mp4a/init.mp4"
            media="audio/mp4a/segment_$Number%06d$.m4s"
            startNumber="0"
            duration="18">
          </SegmentTemplate>
        </Representation>
      </AdaptationSet>
        <AdaptationSet
        id="1"
        contentType="video"
        startWithSAP="1"
        segmentAlignment="true"
        bitstreamSwitching="true">
        <Representation
          id="avc1_360p30"
          mimeType="video/mp4"
          codecs="avc1.4d001f"
          bandwidth="586748"
          width="640"
          height="360"
          frameRate="30">
          <SegmentTemplate
            timescale="1"
            initialization="video/avc1_360p30/init.mp4"
            media="video/avc1_360p30/segment_$Number%06d$.m4s"
            startNumber="0"
            duration="6">
          </SegmentTemplate>
        </Representation>
      </AdaptationSet>
        </Period>
      </MPD>`);
      });

    expect(scope1.isDone()).toBe(true);
    expect(scope2.isDone()).toBe(true);
  });
});
