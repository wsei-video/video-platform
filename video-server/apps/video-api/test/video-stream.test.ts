import { HttpStatus } from '@nestjs/common';

import { Channel, Video } from '@video/lib/database/client';
import { DateUtils } from '@video/lib/utils';
import { Id } from '@video/lib/restful';

import { TestingAuth, TestingFixture } from './testing/fixture';
import { AuthConstants } from '@video/lib/auth';

describe('Video', () => {
  let fixture: TestingFixture;
  let auth: TestingAuth;

  beforeEach(async () => {
    fixture = await TestingFixture.create();
    auth = await fixture.createAuth();
  });

  afterEach(() => fixture.destroy());

  test('List streams video not found', () => {
    return fixture
      .request()
      .get(`/v1/videos/${Id.clear(0).encrypted}/streams`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Video' } });
  });

  describe('Video exists', () => {
    let myChannel: Channel;
    let myVideo: Video;

    beforeEach(async () => {
      myChannel = await fixture.database.channel.create({
        data: {
          name: 'My Channel',
          slug: 'my-channel',
          createdAt: DateUtils.now(),
          accountChannelConnections: {
            create: {
              accountId: auth.account.id,
              createdAt: DateUtils.now(),
            },
          },
        },
      });

      myVideo = await fixture.database.video.create({
        data: {
          title: 'My video',
          channelId: myChannel.id,
          createdAt: DateUtils.now(),
        },
      });
    });

    test('List streams empty', () => {
      return fixture
        .request()
        .get(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams`)
        .expect(HttpStatus.OK)
        .expect({ video: [], audio: [], adaptive: [] });
    });

    test('Create video stream not internal', () => {
      return fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/video`)
        .send({})
        .expect(HttpStatus.FORBIDDEN);
    });

    test('Create audio stream not internal', () => {
      return fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/audio`)
        .send({})
        .expect(HttpStatus.FORBIDDEN);
    });

    test('Create video stream', async () => {
      await fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/video`)
        .set(AuthConstants.InternalHeader, fixture.config.video.apiInternalKey)
        .send({
          codecName: 'H.264',
          codecId: 'avc1.4d001f',
          stream: 'avc1_360p30',
          width: 640,
          height: 360,
          framerate: 30,
          averageBitrate: 586748,
          peakBitrate: 821936,
          size: 6847474589,
        })
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams`)
        .expect(HttpStatus.OK)
        .expect({
          video: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              format: 'hls',
              codec: { name: 'H.264', id: 'avc1.4d001f' },
              width: 640,
              height: 360,
              framerate: 30,
              averageBitrate: 586748,
              peakBitrate: 821936,
              size: 6847474589,
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
              size: 6847474589,
              url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/video/avc1_360p30/playlist.mpd',
            },
          ],
          audio: [],
          adaptive: [
            { format: 'hls', url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/master.m3u8' },
            { format: 'dash', url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/master.mpd' },
          ],
        });
    });

    test('Create audio stream', async () => {
      await fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/audio`)
        .set(AuthConstants.InternalHeader, fixture.config.video.apiInternalKey)
        .send({
          codecName: 'AAC',
          codecId: 'mp4a.40.2',
          stream: 'mp4a',
          channels: 2,
          size: 132864,
        })
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams`)
        .expect(HttpStatus.OK)
        .expect({
          video: [],
          audio: [
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
          ],
          adaptive: [],
        });
    });
  });
});
