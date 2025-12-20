import { DateUtils } from '@video/lib/utils';
import { TestingAuth, TestingFixture } from './testing/fixture';
import { Account, Channel, Video, VideoReaction } from '@video/lib/database/client';
import { Id } from '@video/lib/restful';
import { HttpStatus } from '@nestjs/common';

describe('Video reaction', () => {
  let fixture: TestingFixture;
  let auth: TestingAuth;

  let myChannel: Channel;
  let myVideo: Video;

  const reactionEndpoint = (videoId: number) => `/v1/videos/${Id.clear(videoId).encrypted}`;

  beforeEach(async () => {
    fixture = await TestingFixture.create();
    auth = await fixture.createAuth();

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

  afterEach(() => fixture.destroy());

  test('Get non existent reaction', () => {
    return fixture
      .request()
      .get(`${reactionEndpoint(myVideo.id)}/reactions/${Id.clear(123).encrypted}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'VideoReaction' } });
  });

  test('Get reaction wrong id', () => {
    return fixture
      .request()
      .get(`${reactionEndpoint(myVideo.id)}/reactions/invalid-id`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('List reactions empty', () => {
    return fixture
      .request()
      .get(`${reactionEndpoint(myVideo.id)}/reactions`)
      .expect(HttpStatus.OK)
      .expect({
        total: 0,
        next: false,
        items: [],
      });
  });

  test('React to video unauthenticated', () => {
    return fixture
      .request()
      .put(`${reactionEndpoint(myVideo.id)}/reaction`)
      .send({ content: 'like' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  test('React to video invalid body', () => {
    return fixture
      .request()
      .put(`${reactionEndpoint(myVideo.id)}/reaction`)
      .set('Authorization', auth.header)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        error: 'BadRequest',
        statusCode: 400,
        reason: {
          name: 'InvalidBody',
          issues: { content: ['isString'] },
        },
      });
  });

  test('React to video', () => {
    return fixture
      .request()
      .put(`${reactionEndpoint(myVideo.id)}/reaction`)
      .set('Authorization', auth.header)
      .send({ content: 'like' })
      .expect(HttpStatus.OK)
      .expect({
        id: '-Y5OWS2exwnMaKM-RWHDVg',
        content: 'like',
        createdAt: '2025-10-01T10:00:00.000Z',
        userId: '-Y5OWS2exwnMaKM-RWHDVg',
        videoId: '-Y5OWS2exwnMaKM-RWHDVg',
      });
  });

  test('React to video updates existing reaction', async () => {
    await fixture.database.videoReaction.create({
      data: {
        content: 'like',
        videoId: myVideo.id,
        userId: auth.account.id,
        createdAt: DateUtils.now(),
      },
    });

    return fixture
      .request()
      .put(`${reactionEndpoint(myVideo.id)}/reaction`)
      .set('Authorization', auth.header)
      .send({ content: 'dislike' })
      .expect(HttpStatus.OK)
      .expect({
        id: '-Y5OWS2exwnMaKM-RWHDVg',
        content: 'dislike',
        createdAt: '2025-10-01T10:00:00.000Z',
        userId: '-Y5OWS2exwnMaKM-RWHDVg',
        videoId: '-Y5OWS2exwnMaKM-RWHDVg',
      });
  });

  describe('Reaction exists', () => {
    let myReaction: VideoReaction;
    let anotherAccount: Account;
    let anotherReaction: VideoReaction;

    beforeEach(async () => {
      myReaction = await fixture.database.videoReaction.create({
        data: {
          content: 'like',
          videoId: myVideo.id,
          userId: auth.account.id,
          createdAt: DateUtils.now(),
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

      anotherReaction = await fixture.database.videoReaction.create({
        data: {
          content: 'dislike',
          videoId: myVideo.id,
          userId: anotherAccount.id,
          createdAt: DateUtils.now(),
        },
      });
    });

    test('Find reaction by id', () => {
      return fixture
        .request()
        .get(`${reactionEndpoint(myVideo.id)}/reactions/${Id.clear(myReaction.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          content: 'like',
          createdAt: '2025-10-01T10:00:00.000Z',
          userId: '-Y5OWS2exwnMaKM-RWHDVg',
          videoId: '-Y5OWS2exwnMaKM-RWHDVg',
        });
    });

    test('Get my reaction', () => {
      return fixture
        .request()
        .get(`${reactionEndpoint(myVideo.id)}/reaction`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          content: 'like',
          createdAt: '2025-10-01T10:00:00.000Z',
          userId: '-Y5OWS2exwnMaKM-RWHDVg',
          videoId: '-Y5OWS2exwnMaKM-RWHDVg',
        });
    });

    test('Get my reaction unauthenticated', () => {
      return fixture
        .request()
        .get(`${reactionEndpoint(myVideo.id)}/reaction`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('List reactions', () => {
      return fixture
        .request()
        .get(`${reactionEndpoint(myVideo.id)}/reactions`)
        .expect(HttpStatus.OK)
        .expect({
          total: 2,
          next: false,
          items: [
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

    test('Delete reaction not found', () => {
      return fixture
        .request()
        .delete(`${reactionEndpoint(myVideo.id)}/reactions/${Id.clear(123).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'VideoReaction' } });
    });

    test('Delete reaction not authenticated', () => {
      return fixture
        .request()
        .delete(`${reactionEndpoint(myVideo.id)}/reactions/${Id.clear(myReaction.id).encrypted}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('Delete reaction not owner', () => {
      return fixture
        .request()
        .delete(`${reactionEndpoint(myVideo.id)}/reactions/${Id.clear(anotherReaction.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Delete reaction', () => {
      return fixture
        .request()
        .delete(`${reactionEndpoint(myVideo.id)}/reactions/${Id.clear(myReaction.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');
    });

    test('Remove my reaction', () => {
      return fixture
        .request()
        .delete(`${reactionEndpoint(myVideo.id)}/reaction`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');
    });

    test('Remove my reaction unauthenticated', () => {
      return fixture
        .request()
        .delete(`${reactionEndpoint(myVideo.id)}/reaction`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
