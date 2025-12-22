import * as path from 'node:path';

import { describe, test, beforeEach, afterEach } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import nock from 'nock';

import { Id } from '@video/lib/restful';
import { QueueExchange, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';
import { UploadToken } from '@video/lib/token';

import { TestingFixture } from './testing/fixture';

describe('Simple upload (multipart)', () => {
  const filePath = path.join(__dirname, 'assets', 'file.txt');

  let fixture: TestingFixture;

  beforeEach(async () => (fixture = await TestingFixture.create()));

  afterEach(() => fixture.destroy());

  test('Upload file invalid token', () => {
    return fixture
      .request()
      .post('/v1/upload/video/simple/invalid')
      .attach('file', filePath)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ error: 'Unauthorized', statusCode: 401 });
  });

  test('Upload file expired token', () => {
    const token = new UploadToken({
      accountId: Id.clear(1),
      expiresAt: new Date('2025-10-01T10:00:00.000Z'),
      videoId: Id.clear(1),
    }).encrypt();

    return fixture
      .request()
      .post(`/v1/upload/video/simple/${token}`)
      .attach('file', filePath)
      .expect(HttpStatus.GONE)
      .expect({ error: 'Gone', statusCode: 410 });
  });

  test('Upload file', async () => {
    const accountId = Id.clear(1);
    const videoId = Id.clear(1);

    const token = new UploadToken({
      accountId,
      expiresAt: new Date('2025-10-01T10:01:00.000Z'),
      videoId,
    }).encrypt();

    const queue = await fixture.queue(QueueExchange.Media, QueueTask.Identify);

    const scope = nock('http://api.video.internal')
      .patch(`/v1/videos/${videoId.encrypted}/source`, {
        name: 'file.txt',
        size: 13,
        userId: accountId.encrypted,
        key: token,
      })
      .reply(HttpStatus.NO_CONTENT);

    await fixture
      .request()
      .post(`/v1/upload/video/simple/${token}`)
      .attach('file', filePath)
      .expect(HttpStatus.NO_CONTENT)
      .expect('');

    expect(scope.isDone()).toBe(true);

    const uploadObject = await fixture.storage.getObject(StorageConstants.uploadsBucket, token);
    const uploadBuffer = await uploadObject?.body.toArray();
    expect(uploadBuffer?.toString()).toBe('Testing file\n');

    expect(queue.messages).toHaveLength(1);
    expect(queue.messages[0]).toEqual({ key: token });
    await queue.destroy();
  });
});
