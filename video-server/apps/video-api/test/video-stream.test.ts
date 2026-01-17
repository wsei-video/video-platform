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
        .expect({ video: [], audio: [], adaptive: [], scrubber: null });
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
              size: 6847474589,
              url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/video/avc1_360p30/playlist.mpd',
              name: 'avc1_360p30',
            },
          ],
          audio: [],
          adaptive: [
            { format: 'hls', url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/master.m3u8' },
            { format: 'dash', url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/master.mpd' },
          ],
          scrubber: null,
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
          ],
          adaptive: [],
          scrubber: null,
        });
    });

    test('Create scrubber image', async () => {
      await fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/scrubber`)
        .set(AuthConstants.InternalHeader, fixture.config.video.apiInternalKey)
        .send({
          columns: 8,
          count: 2,
          frameDuration: 2,
          height: 135,
          rows: 4,
          width: 240,
        })
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams`)
        .expect(HttpStatus.OK)
        .expect({
          video: [],
          audio: [],
          adaptive: [],
          scrubber: {
            columns: 8,
            count: 2,
            frameDuration: 2,
            height: 135,
            rows: 4,
            width: 240,
            urls: [
              'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/image/scrubber/scrubber_000001.jpg',
              'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/image/scrubber/scrubber_000002.jpg',
            ],
          },
        });
    });

    test('Create thumbnails', async () => {
      await fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/thumbnail`)
        .set(AuthConstants.InternalHeader, fixture.config.video.apiInternalKey)
        .send({
          name: 'thumbnail_1',
          variants: '256x144',
          select: false,
        })
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/thumbnail`)
        .set(AuthConstants.InternalHeader, fixture.config.video.apiInternalKey)
        .send({
          name: 'thumbnail_2',
          variants: '640x360',
          select: true,
        })
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .post(`/v1/videos/${Id.clear(myVideo.id).encrypted}/streams/thumbnail`)
        .set(AuthConstants.InternalHeader, fixture.config.video.apiInternalKey)
        .send({
          name: 'thumbnail_3',
          variants: '256x144,426x240',
          select: false,
        })
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/videos/${Id.clear(myVideo.id).encrypted}/thumbnails`)
        .set('Authorization', `Bearer ${auth.accessToken}`)
        .expect(HttpStatus.OK)
        .expect({
          total: 3,
          next: false,
          items: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              variants: [
                {
                  url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/image/thumbnail/thumbnail_1_144p.jpg',
                  width: 256,
                  height: 144,
                },
              ],
            },
            {
              id: '1F7QtAWVDfuRrA54Fs_6Nw',
              variants: [
                {
                  url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/image/thumbnail/thumbnail_2_360p.jpg',
                  width: 640,
                  height: 360,
                },
              ],
            },
            {
              id: 'qlgbfa88WMVNug8OWMR-9w',
              variants: [
                {
                  url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/image/thumbnail/thumbnail_3_144p.jpg',
                  width: 256,
                  height: 144,
                },
                {
                  url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/image/thumbnail/thumbnail_3_240p.jpg',
                  width: 426,
                  height: 240,
                },
              ],
            },
          ],
        });

      await fixture
        .request()
        .get(`/v1/videos/${Id.clear(myVideo.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect(response => {
          expect(response.body.thumbnail).toEqual({
            id: '1F7QtAWVDfuRrA54Fs_6Nw',
            variants: [
              {
                height: 360,
                url: 'http://cdn.video.local/media/-Y5OWS2exwnMaKM-RWHDVg/image/thumbnail/thumbnail_2_360p.jpg',
                width: 640,
              },
            ],
          });
        });

      await fixture
        .request()
        .delete(`/v1/videos/${Id.clear(myVideo.id).encrypted}/thumbnails/1F7QtAWVDfuRrA54Fs_6Nw`)
        .set('Authorization', `Bearer ${auth.accessToken}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/videos/${Id.clear(myVideo.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect(response => {
          expect(response.body.thumbnail).toBeNull();
        });
    });
  });
});
