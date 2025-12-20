import { HttpStatus } from '@nestjs/common';

import { DateUtils } from '@video/lib/utils';

import { Account, Channel } from '@video/lib/database/client';
import { Id } from '@video/lib/restful';
import { TestingAuth, TestingFixture } from './testing/fixture';

describe('Channel', () => {
  let fixture: TestingFixture;
  let auth: TestingAuth;

  beforeEach(async () => {
    fixture = await TestingFixture.create();
    auth = await fixture.createAuth();
  });

  afterEach(() => fixture.destroy());

  test('List channels when unauthenticated', () => {
    return fixture.request().get('/v1/channels').expect(HttpStatus.UNAUTHORIZED);
  });

  test('List channels empty', () => {
    return fixture.request().get('/v1/channels').set('Authorization', auth.header).expect(HttpStatus.OK).expect({
      total: 0,
      next: false,
      items: [],
    });
  });

  test('Create a channel when unauthenticated', () => {
    return fixture.request().post('/v1/channels').expect(HttpStatus.UNAUTHORIZED);
  });

  test('Create a channel invalid body', () => {
    return fixture
      .request()
      .post('/v1/channels')
      .set('Authorization', auth.header)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        error: 'BadRequest',
        statusCode: 400,
        reason: {
          name: 'InvalidBody',
          issues: { name: ['isLength', 'isString'], slug: ['isLength', 'matches', 'isString'] },
        },
      });
  });

  test('Create a channel', () => {
    return fixture
      .request()
      .post('/v1/channels')
      .set('Authorization', auth.header)
      .send({
        name: 'My Channel',
        slug: 'my-channel',
      })
      .expect(HttpStatus.CREATED)
      .expect({
        id: '-Y5OWS2exwnMaKM-RWHDVg',
        name: 'My Channel',
        slug: 'my-channel',
        createdAt: '2025-10-01T10:00:00.000Z',
      });
  });

  describe('Existing channels', () => {
    let myChannel: Channel;
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
    });

    test('Find channel by id', () => {
      return fixture
        .request()
        .get(`/v1/channels/${Id.clear(myChannel.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          name: 'My Channel',
          slug: 'my-channel',
          createdAt: '2025-10-01T10:00:00.000Z',
        });
    });

    test('Find channel by id not found', () => {
      return fixture
        .request()
        .get(`/v1/channels/${Id.clear(0).encrypted}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Channel' } });
    });

    test('Find channel by slug', () => {
      return fixture.request().get(`/v1/channel/slug/${myChannel.slug}`).expect(HttpStatus.OK).expect({
        id: '-Y5OWS2exwnMaKM-RWHDVg',
        name: 'My Channel',
        slug: 'my-channel',
        createdAt: '2025-10-01T10:00:00.000Z',
      });
    });

    test('Find channel by slug not found', () => {
      return fixture
        .request()
        .get('/v1/channel/slug/not-found')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Channel' } });
    });

    test('List account channels', () => {
      return fixture
        .request()
        .get('/v1/channels?page=1&count=10')
        .set('Authorization', auth.header)
        .expect(HttpStatus.OK)
        .expect({
          total: 1,
          next: false,
          items: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              name: 'My Channel',
              slug: 'my-channel',
              createdAt: '2025-10-01T10:00:00.000Z',
            },
          ],
        });
    });

    test('Create channel when slug already taken', () => {
      return fixture
        .request()
        .post('/v1/channels')
        .set('Authorization', auth.header)
        .send({
          name: 'My Channel 2',
          slug: 'my-channel',
        })
        .expect(HttpStatus.CONFLICT)
        .expect({ error: 'Conflict', statusCode: 409, reason: { name: 'SlugAlreadyExists', resource: 'Channel' } });
    });

    test('Update another channel no permissions', () => {
      return fixture
        .request()
        .patch(`/v1/channels/${Id.clear(anotherChannel.id).encrypted}`)
        .set('Authorization', auth.header)
        .send({ name: 'New name' })
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Update channel when slug already exists', () => {
      return fixture
        .request()
        .patch(`/v1/channels/${Id.clear(myChannel.id).encrypted}`)
        .set('Authorization', auth.header)
        .send({ slug: 'another-channel' })
        .expect(HttpStatus.CONFLICT)
        .expect({ error: 'Conflict', statusCode: 409, reason: { name: 'SlugAlreadyExists', resource: 'Channel' } });
    });

    test('Update channel', () => {
      return fixture
        .request()
        .patch(`/v1/channels/${Id.clear(myChannel.id).encrypted}`)
        .set('Authorization', auth.header)
        .send({ name: 'New name' })
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          name: 'New name',
          slug: 'my-channel',
          createdAt: '2025-10-01T10:00:00.000Z',
        });
    });

    test('Delete another channel no permissions', () => {
      return fixture
        .request()
        .delete(`/v1/channels/${Id.clear(anotherChannel.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Delete channel', async () => {
      await fixture
        .request()
        .delete(`/v1/channels/${Id.clear(myChannel.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/channels/${Id.clear(myChannel.id).encrypted}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    test('List channel accounts no permissions', () => {
      return fixture
        .request()
        .get(`/v1/channels/${Id.clear(anotherChannel.id).encrypted}/accounts`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('List channel accounts', () => {
      return fixture
        .request()
        .get(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.OK)
        .expect({
          total: 1,
          next: false,
          items: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              email: 'john@example.com',
              name: 'John Doe',
              createdAt: '2025-10-01T10:00:00.000Z',
            },
          ],
        });
    });

    test('Link account to channel no permissions', () => {
      return fixture
        .request()
        .post(`/v1/channels/${Id.clear(anotherChannel.id).encrypted}/accounts`)
        .send({ accountId: Id.clear(auth.account.id).encrypted })
        .set('Authorization', auth.header)
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Link account to channel already linked', () => {
      return fixture
        .request()
        .post(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts`)
        .send({ accountId: Id.clear(auth.account.id).encrypted })
        .set('Authorization', auth.header)
        .expect(HttpStatus.CONFLICT)
        .expect({
          error: 'Conflict',
          statusCode: 409,
          reason: { name: 'AccountIdAlreadyExists', resource: 'AccountChannelConnection' },
        });
    });

    test('Link account to channel invalid id', () => {
      return fixture
        .request()
        .post(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts`)
        .send({ accountId: 'invalid' })
        .set('Authorization', auth.header)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          error: 'BadRequest',
          statusCode: 400,
          reason: { name: 'InvalidBody', issues: { accountId: ['isId'] } },
        });
    });

    test('Link account to channel account not found', () => {
      return fixture
        .request()
        .post(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts`)
        .send({ accountId: Id.clear(0).encrypted })
        .set('Authorization', auth.header)
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Account' } });
    });

    test('Link account to and unlink account from channel', async () => {
      await fixture
        .request()
        .post(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts`)
        .send({ accountId: Id.clear(anotherAccount.id).encrypted })
        .set('Authorization', auth.header)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.OK)
        .expect({
          total: 2,
          next: false,
          items: [
            {
              id: '1F7QtAWVDfuRrA54Fs_6Nw',
              email: 'another@example.com',
              name: 'Another account',
              createdAt: '2025-10-01T10:00:00.000Z',
            },
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              email: 'john@example.com',
              name: 'John Doe',
              createdAt: '2025-10-01T10:00:00.000Z',
            },
          ],
        });

      await fixture
        .request()
        .delete(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts/${Id.clear(anotherAccount.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');

      await fixture
        .request()
        .get(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.OK)
        .expect({
          total: 1,
          next: false,
          items: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              email: 'john@example.com',
              name: 'John Doe',
              createdAt: '2025-10-01T10:00:00.000Z',
            },
          ],
        });
    });

    test('Unlink account from channel no permissions', () => {
      return fixture
        .request()
        .delete(
          `/v1/channels/${Id.clear(anotherChannel.id).encrypted}/accounts/${Id.clear(anotherAccount.id).encrypted}`,
        )
        .set('Authorization', auth.header)
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Unlink account from channel not found', () => {
      return fixture
        .request()
        .delete(`/v1/channels/${Id.clear(myChannel.id).encrypted}/accounts/${Id.clear(anotherAccount.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          error: 'NotFound',
          statusCode: 404,
          reason: { resource: 'AccountChannelConnection' },
        });
    });

    describe('Existing video', () => {
      beforeEach(async () => {
        const video = await fixture.database.video.create({
          data: {
            title: 'My video',
            channelId: myChannel.id,
            createdAt: DateUtils.now(),
          },
        });

        await fixture.database.videoReaction.create({
          data: {
            content: 'like',
            videoId: video.id,
            userId: auth.account.id,
            createdAt: DateUtils.now(),
          },
        });

        await fixture.database.comment.create({
          data: {
            content: 'Cool video',
            createdAt: DateUtils.now(),
            videoId: video.id,
            userId: auth.account.id,
          },
        });
      });

      test('List videos on channel', () => {
        return fixture
          .request()
          .get(`/v1/channels/${Id.clear(myChannel.id).encrypted}/videos`)
          .set('Authorization', auth.header)
          .expect(HttpStatus.OK)
          .expect({
            total: 1,
            next: false,
            items: [
              {
                id: '-Y5OWS2exwnMaKM-RWHDVg',
                title: 'My video',
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
                commentCount: 1,
                visibility: 'public',
                status: 'none',
                reactions: [
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
              },
            ],
          });
      });
    });
  });
});
