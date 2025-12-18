import { HttpStatus } from '@nestjs/common';
import { TestingAuth, TestingFixture } from './testing/fixture';
import { Id } from '@video/lib/restful';
import { DateUtils } from '@video/lib/utils';
import { Account, Channel, Video, VideoStatus, VideoVisibility } from '@video/lib/database/client';

describe('Video', () => {
  let fixture: TestingFixture;
  let auth: TestingAuth;
  const videoEndpoint = '/v1/videos';

  beforeEach(async () => {
    fixture = await TestingFixture.create();
    auth = await fixture.createAuth();
  });

  afterEach(() => fixture.destroy());

  test('Get video wrong id', () => {
    return fixture.request().get(`${videoEndpoint}/1234`).expect(HttpStatus.BAD_REQUEST);
  });

  test('Get non existent video', () => {
    return fixture
      .request()
      .get(`${videoEndpoint}/${Id.clear(123).encrypted}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Video' } });
  });

  test('Create video unauthenticated', () => {
    fixture.request().post(videoEndpoint).expect(HttpStatus.UNAUTHORIZED);
  });

  test('Create video invalid body', () => {
    return fixture
      .request()
      .post(videoEndpoint)
      .set('Authorization', auth.header)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        error: 'BadRequest',
        statusCode: 400,
        reason: {
          name: 'InvalidBody',
          issues: { channelId: ['isId'], title: ['isString'] },
        },
      });
  });

  test('Create video', async () => {
    const myChannel = await fixture.database.channel.create({
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

    return fixture
      .request()
      .post(videoEndpoint)
      .set('Authorization', auth.header)
      .send({
        title: 'Test video',
        channelId: Id.clear(myChannel.id).encrypted,
      })
      .expect(HttpStatus.CREATED)
      .expect({
        id: '-Y5OWS2exwnMaKM-RWHDVg',
        title: 'Test video',
        description: '',
        hlsUrl: null,
        thumbnail: null,
        duration: 0,
        createdAt: '2025-10-01T10:00:00.000Z',
        views: 0,
        visibility: VideoVisibility.public,
        status: VideoStatus.none,
      });
  });

  describe('Video exists', () => {
    let myChannel: Channel;
    let myVideo: Video;
    let anotherVideo: Video;
    let anotherAccount: Account;
    let anotherChannel: Channel;

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

      anotherAccount = await fixture.database.account.create({
        data: {
          email: 'another@example.com',
          name: 'Another account',
          passwordHash: '',
          createdAt: DateUtils.now(),
        },
      });

      anotherChannel = await fixture.database.channel.create({
        data: {
          name: 'Another Channel',
          slug: 'another-channel',
          createdAt: DateUtils.now(),
          accountChannelConnections: {
            create: {
              accountId: anotherAccount.id,
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

      anotherVideo = await fixture.database.video.create({
        data: {
          title: 'Another video',
          channelId: anotherChannel.id,
          createdAt: DateUtils.now(),
        },
      });
    });

    test('Find video by id', () => {
      return fixture
        .request()
        .get(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          title: 'My video',
          description: '',
          hlsUrl: null,
          thumbnail: null,
          duration: 0,
          createdAt: '2025-10-01T10:00:00.000Z',
          views: 0,
          visibility: VideoVisibility.public,
          status: VideoStatus.none,
          channel: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            name: 'My Channel',
            slug: 'my-channel',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
          reactions: [],
        });
    });

    test('Find video by id with reactions', async () => {
      await fixture.database.videoReaction.create({
        data: {
          content: 'like',
          videoId: myVideo.id,
          userId: auth.account.id,
          createdAt: DateUtils.now(),
        },
      });

      await fixture.database.videoReaction.create({
        data: {
          content: 'dislike',
          videoId: myVideo.id,
          userId: anotherAccount.id,
          createdAt: DateUtils.now(),
        },
      });

      return fixture
        .request()
        .get(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          title: 'My video',
          description: '',
          hlsUrl: null,
          thumbnail: null,
          duration: 0,
          createdAt: '2025-10-01T10:00:00.000Z',
          views: 0,
          visibility: VideoVisibility.public,
          status: VideoStatus.none,
          channel: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            name: 'My Channel',
            slug: 'my-channel',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
          reactions: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              content: 'like',
              createdAt: '2025-10-01T10:00:00.000Z',
              userId: '-Y5OWS2exwnMaKM-RWHDVg',
              videoId: '-Y5OWS2exwnMaKM-RWHDVg',
            },
            {
              id: '1F7QtAWVDfuRrA54Fs_6Nw',
              content: 'dislike',
              createdAt: '2025-10-01T10:00:00.000Z',
              userId: '1F7QtAWVDfuRrA54Fs_6Nw',
              videoId: '-Y5OWS2exwnMaKM-RWHDVg',
            },
          ],
        });
    });

    test('Update video not found', async () => {
      return fixture
        .request()
        .patch(`${videoEndpoint}/${Id.clear(123).encrypted}`)
        .set('Authorization', auth.header)
        .send({
          description: 'New description',
          title: 'New my video title',
        })
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Video' } });
    });

    test('Update video not authenticated', () => {
      return fixture
        .request()
        .patch(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}`)
        .send({
          description: 'New description',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('Update video not channel member', async () => {
      return fixture
        .request()
        .patch(`${videoEndpoint}/${Id.clear(anotherVideo.id).encrypted}`)
        .set('Authorization', auth.header)
        .send({
          description: 'New description',
        })
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Update video', async () => {
      return fixture
        .request()
        .patch(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}`)
        .set('Authorization', auth.header)
        .send({
          description: 'New description',
          title: 'New my video title',
        })
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          title: 'New my video title',
          description: 'New description',
          hlsUrl: null,
          thumbnail: null,
          duration: 0,
          createdAt: '2025-10-01T10:00:00.000Z',
          views: 0,
          visibility: VideoVisibility.public,
          status: VideoStatus.none,
          channel: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            name: 'My Channel',
            slug: 'my-channel',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
        });
    });

    test('Delete video not found', async () => {
      return fixture
        .request()
        .delete(`${videoEndpoint}/${Id.clear(123).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Video' } });
    });

    test('Delete video not authenticated', async () => {
      return fixture
        .request()
        .delete(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('Delete video not channel member', async () => {
      return fixture
        .request()
        .delete(`${videoEndpoint}/${Id.clear(anotherVideo.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Delete video', async () => {
      return fixture
        .request()
        .delete(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');
    });
  });
});
