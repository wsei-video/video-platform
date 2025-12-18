import { DateUtils } from '@video/lib/utils';
import { TestingAuth, TestingFixture } from './testing/fixture';
import { Account, Channel, Comment, Video } from '@video/lib/database/client';
import { Id } from '@video/lib/restful';
import { HttpStatus } from '@nestjs/common';

describe('Video comment', () => {
  let fixture: TestingFixture;
  let auth: TestingAuth;

  let myChannel: Channel;
  let myVideo: Video;

  const commentEndpoint = (videoId: number) => `/v1/videos/${Id.clear(videoId).encrypted}/comments`;

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

  test('Get non existent comment', () => {
    return fixture
      .request()
      .get(`${commentEndpoint(myVideo.id)}/${Id.clear(123).encrypted}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Comment' } });
  });

  test('Get comment wrong id', () => {
    return fixture
      .request()
      .get(`${commentEndpoint(myVideo.id)}/invalid-id`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('List comments empty', () => {
    return fixture.request().get(commentEndpoint(myVideo.id)).expect(HttpStatus.OK).expect({
      total: 0,
      next: false,
      items: [],
    });
  });

  test('Create comment unauthenticated', () => {
    return fixture
      .request()
      .post(commentEndpoint(myVideo.id))
      .send({ content: 'Test comment' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  test('Create comment invalid body', () => {
    return fixture
      .request()
      .post(commentEndpoint(myVideo.id))
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

  test('Create comment', () => {
    return fixture
      .request()
      .post(commentEndpoint(myVideo.id))
      .set('Authorization', auth.header)
      .send({ content: 'This is a test comment' })
      .expect(HttpStatus.CREATED)
      .expect({
        id: '-Y5OWS2exwnMaKM-RWHDVg',
        content: 'This is a test comment',
        createdAt: '2025-10-01T10:00:00.000Z',
        updatedAt: null,
        parentId: null,
        replies: [],
        reactions: [],
      });
  });

  describe('Comment exists', () => {
    let myComment: Comment;
    let anotherAccount: Account;
    let anotherComment: Comment;

    beforeEach(async () => {
      myComment = await fixture.database.comment.create({
        data: {
          content: 'My comment',
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

      anotherComment = await fixture.database.comment.create({
        data: {
          content: 'Another comment',
          videoId: myVideo.id,
          userId: anotherAccount.id,
          createdAt: DateUtils.now(),
        },
      });
    });

    test('Find comment by id', () => {
      return fixture
        .request()
        .get(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          content: 'My comment',
          createdAt: '2025-10-01T10:00:00.000Z',
          updatedAt: null,
          parentId: null,
          replies: [],
          reactions: [],
        });
    });

    test('Find comment by id with reactions', async () => {
      await fixture.database.commentReaction.create({
        data: {
          content: 'like',
          commentId: myComment.id,
          userId: auth.account.id,
          createdAt: DateUtils.now(),
        },
      });

      await fixture.database.commentReaction.create({
        data: {
          content: 'dislike',
          commentId: myComment.id,
          userId: anotherAccount.id,
          createdAt: DateUtils.now(),
        },
      });

      return fixture
        .request()
        .get(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          content: 'My comment',
          createdAt: '2025-10-01T10:00:00.000Z',
          updatedAt: null,
          parentId: null,
          replies: [],
          reactions: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              content: 'like',
              createdAt: '2025-10-01T10:00:00.000Z',
              userId: '-Y5OWS2exwnMaKM-RWHDVg',
              commentId: '-Y5OWS2exwnMaKM-RWHDVg',
            },
            {
              id: '1F7QtAWVDfuRrA54Fs_6Nw',
              content: 'dislike',
              createdAt: '2025-10-01T10:00:00.000Z',
              userId: '1F7QtAWVDfuRrA54Fs_6Nw',
              commentId: '-Y5OWS2exwnMaKM-RWHDVg',
            },
          ],
        });
    });

    test('List comments', async () => {
      await fixture.database.commentReaction.create({
        data: {
          content: 'like',
          commentId: myComment.id,
          userId: auth.account.id,
          createdAt: DateUtils.now(),
        },
      });

      await fixture.database.commentReaction.create({
        data: {
          content: 'dislike',
          commentId: myComment.id,
          userId: anotherAccount.id,
          createdAt: DateUtils.now(),
        },
      });

      return fixture
        .request()
        .get(commentEndpoint(myVideo.id))
        .expect(HttpStatus.OK)
        .expect({
          total: 2,
          next: false,
          items: [
            {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              content: 'My comment',
              createdAt: '2025-10-01T10:00:00.000Z',
              updatedAt: null,
              parentId: null,
              replies: [],
              reactions: [
                {
                  id: '-Y5OWS2exwnMaKM-RWHDVg',
                  content: 'like',
                  createdAt: '2025-10-01T10:00:00.000Z',
                  userId: '-Y5OWS2exwnMaKM-RWHDVg',
                  commentId: '-Y5OWS2exwnMaKM-RWHDVg',
                },
                {
                  id: '1F7QtAWVDfuRrA54Fs_6Nw',
                  content: 'dislike',
                  createdAt: '2025-10-01T10:00:00.000Z',
                  userId: '1F7QtAWVDfuRrA54Fs_6Nw',
                  commentId: '-Y5OWS2exwnMaKM-RWHDVg',
                },
              ],
            },
            {
              id: '1F7QtAWVDfuRrA54Fs_6Nw',
              content: 'Another comment',
              createdAt: '2025-10-01T10:00:00.000Z',
              updatedAt: null,
              parentId: null,
              replies: [],
              reactions: [],
            },
          ],
        });
    });

    test('Update comment not found', () => {
      return fixture
        .request()
        .patch(`${commentEndpoint(myVideo.id)}/${Id.clear(123).encrypted}`)
        .set('Authorization', auth.header)
        .send({ content: 'Updated content' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Comment' } });
    });

    test('Update comment not authenticated', () => {
      return fixture
        .request()
        .patch(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
        .send({ content: 'Updated content' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('Update comment not owner', () => {
      return fixture
        .request()
        .patch(`${commentEndpoint(myVideo.id)}/${Id.clear(anotherComment.id).encrypted}`)
        .set('Authorization', auth.header)
        .send({ content: 'Updated content' })
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Update comment', () => {
      return fixture
        .request()
        .patch(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
        .set('Authorization', auth.header)
        .send({ content: 'Updated comment content' })
        .expect(HttpStatus.OK)
        .expect({
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          content: 'Updated comment content',
          createdAt: '2025-10-01T10:00:00.000Z',
          updatedAt: '2025-10-01T10:00:00.000Z',
          parentId: null,
          replies: [],
          reactions: [],
        });
    });

    test('Delete comment not found', () => {
      return fixture
        .request()
        .delete(`${commentEndpoint(myVideo.id)}/${Id.clear(123).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NOT_FOUND)
        .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Comment' } });
    });

    test('Delete comment not authenticated', () => {
      return fixture
        .request()
        .delete(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('Delete comment not owner', () => {
      return fixture
        .request()
        .delete(`${commentEndpoint(myVideo.id)}/${Id.clear(anotherComment.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.FORBIDDEN)
        .expect({ error: 'Forbidden', statusCode: 403 });
    });

    test('Delete comment', () => {
      return fixture
        .request()
        .delete(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
        .set('Authorization', auth.header)
        .expect(HttpStatus.NO_CONTENT)
        .expect('');
    });

    describe('Reply to comment', () => {
      test('Reply to comment unauthenticated', () => {
        return fixture
          .request()
          .post(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
          .send({ content: 'Reply content' })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      test('Reply to non existent comment', () => {
        return fixture
          .request()
          .post(`${commentEndpoint(myVideo.id)}/${Id.clear(123).encrypted}`)
          .set('Authorization', auth.header)
          .send({ content: 'Reply content' })
          .expect(HttpStatus.NOT_FOUND)
          .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'Comment' } });
      });

      test('Reply to comment', () => {
        return fixture
          .request()
          .post(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
          .set('Authorization', auth.header)
          .send({ content: 'This is a reply' })
          .expect(HttpStatus.CREATED)
          .expect({
            id: 'qlgbfa88WMVNug8OWMR-9w',
            content: 'This is a reply',
            createdAt: '2025-10-01T10:00:00.000Z',
            updatedAt: null,
            parentId: '-Y5OWS2exwnMaKM-RWHDVg',
            replies: [],
            reactions: [],
          });
      });

      test('Find comment with replies', async () => {
        await fixture.database.comment.create({
          data: {
            content: 'Reply 1',
            videoId: myVideo.id,
            userId: auth.account.id,
            parentId: myComment.id,
            createdAt: DateUtils.now(),
          },
        });

        await fixture.database.comment.create({
          data: {
            content: 'Reply 2',
            videoId: myVideo.id,
            userId: anotherAccount.id,
            parentId: myComment.id,
            createdAt: DateUtils.now(),
          },
        });

        return fixture
          .request()
          .get(`${commentEndpoint(myVideo.id)}/${Id.clear(myComment.id).encrypted}`)
          .expect(HttpStatus.OK)
          .expect({
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            content: 'My comment',
            createdAt: '2025-10-01T10:00:00.000Z',
            updatedAt: null,
            parentId: null,
            replies: [
              {
                id: 'qlgbfa88WMVNug8OWMR-9w',
                content: 'Reply 1',
                createdAt: '2025-10-01T10:00:00.000Z',
                updatedAt: null,
                parentId: '-Y5OWS2exwnMaKM-RWHDVg',
                reactions: [],
              },
              {
                id: 'DS-EMNX2snGTfBbZYtkaZg',
                content: 'Reply 2',
                createdAt: '2025-10-01T10:00:00.000Z',
                updatedAt: null,
                parentId: '-Y5OWS2exwnMaKM-RWHDVg',
                reactions: [],
              },
            ],
            reactions: [],
          });
      });
    });
  });
});
