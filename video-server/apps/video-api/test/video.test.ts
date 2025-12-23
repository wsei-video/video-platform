import { HttpStatus } from '@nestjs/common';

import { Account, Channel, Video, VideoStatus, VideoVisibility } from '@video/lib/database/client';
import { DateUtils } from '@video/lib/utils';
import { Id } from '@video/lib/restful';

import { TestingAuth, TestingFixture } from './testing/fixture';
import { UploadToken } from '@video/lib/token';

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
        channel: {
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          name: 'My Channel',
          slug: 'my-channel',
          createdAt: '2025-10-01T10:00:00.000Z',
        },
        createdAt: '2025-10-01T10:00:00.000Z',
        views: 0,
        commentCount: 0,
        visibility: VideoVisibility.public,
        status: VideoStatus.none,
        reactions: [],
        userReaction: null,
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
          commentCount: 0,
          visibility: VideoVisibility.public,
          status: VideoStatus.none,
          channel: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            name: 'My Channel',
            slug: 'my-channel',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
          reactions: [],
          userReaction: null,
        });
    });

    test('Find video by id with reactions and comments', async () => {
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

      await fixture.database.comment.create({
        data: {
          content: 'Cool video',
          createdAt: DateUtils.now(),
          videoId: myVideo.id,
          userId: auth.account.id,
        },
      });

      return fixture
        .request()
        .get(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}`)
        .set('Authorization', auth.header)
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
          commentCount: 1,
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
              content: 'dislike',
              count: 1,
            },
            {
              content: 'like',
              count: 1,
            },
          ],
          userReaction: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            content: 'like',
            createdAt: '2025-10-01T10:00:00.000Z',
            userId: '-Y5OWS2exwnMaKM-RWHDVg',
            videoId: '-Y5OWS2exwnMaKM-RWHDVg',
          },
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

    test('Update video', () => {
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
          commentCount: 0,
          visibility: VideoVisibility.public,
          status: VideoStatus.none,
          channel: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            name: 'My Channel',
            slug: 'my-channel',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
          reactions: [],
          userReaction: null,
        });
    });

    test('Create video upload URL not authenticated', () => {
      return fixture
        .request()
        .put(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}/source`)
        .send()
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('Create video upload URL not channel member', () => {
      return fixture
        .request()
        .put(`${videoEndpoint}/${Id.clear(anotherVideo.id).encrypted}/source`)
        .set('Authorization', auth.header)
        .send()
        .expect(HttpStatus.FORBIDDEN);
    });

    test('Create video upload URL', () => {
      const expectedToken = new UploadToken({
        accountId: Id.clear(auth.account.id),
        expiresAt: new Date('2025-10-01T10:01:00.000Z'), // 1 minute from now
        videoId: Id.clear(myVideo.id),
      }).encrypt();

      return fixture
        .request()
        .put(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}/source`)
        .set('Authorization', auth.header)
        .send()
        .expect(HttpStatus.OK)
        .expect({
          simpleUploadUrl: `http://upload.video.local/v1/upload/video/simple/${expectedToken}`,
          resumableUploadUrl: `http://upload.video.local/v1/upload/video/resumable/${expectedToken}`,
        });
    });

    test('Video source not channel member', () => {
      return fixture
        .request()
        .get(`${videoEndpoint}/${Id.clear(anotherVideo.id).encrypted}/source`)
        .set('Authorization', auth.header)
        .send()
        .expect(HttpStatus.FORBIDDEN);
    });

    test('Video source', async () => {
      await fixture
        .request()
        .get(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}/source`)
        .set('Authorization', auth.header)
        .send()
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          error: 'NotFound',
          statusCode: 404,
          reason: { resource: 'VideoSource' },
        });

      await fixture
        .request()
        .patch(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}/source`)
        .send({
          name: 'my-cool-video.mp4',
          size: 103844,
          userId: Id.clear(auth.account.id).encrypted,
          key: 'some-key',
        })
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`${videoEndpoint}/${Id.clear(myVideo.id).encrypted}/source`)
        .set('Authorization', auth.header)
        .send()
        .expect(HttpStatus.OK)
        .expect({
          name: 'my-cool-video.mp4',
          size: 103844,
          user: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            email: 'john@example.com',
            name: 'John Doe',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
          url: 'http://cdn.video.local/uploads/some-key',
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
