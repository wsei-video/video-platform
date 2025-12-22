import * as fs from 'node:fs';
import * as path from 'node:path';

import { describe, test, beforeEach, afterEach } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import nock from 'nock';
import tus from 'tus-js-client';

import { Id } from '@video/lib/restful';
import { QueueExchange, QueueTask } from '@video/lib/queue';
import { StorageConstants } from '@video/lib/storage';
import { UploadToken } from '@video/lib/token';

import { TestingFixture } from './testing/fixture';

describe('Simple resumable (TUS)', () => {
  const filePath = path.join(__dirname, 'assets', 'file.txt');
  const fileBuffer = fs.createReadStream(filePath);

  let fixture: TestingFixture;

  beforeEach(async () => (fixture = await TestingFixture.create()));

  afterEach(() => fixture.destroy());

  const createUpload = (token: string) => {
    const baseUrl = fixture.request().get('').serverAddress(fixture.app.getHttpServer(), '');

    return new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(fileBuffer, {
        uploadUrl: `${baseUrl}/v1/upload/video/resumable/${token}`,
        endpoint: `${baseUrl}/v1/upload/video/resumable/${token}`,
        metadata: {
          filename: 'file.txt',
          filetype: 'text/plain',
        },
        onError: error => {
          if (error instanceof tus.DetailedError) return reject(new Error(error.originalResponse?.getBody()));
          reject(error);
        },
        onSuccess: () => resolve(),
      });

      upload.start();
    });
  };

  test('Upload file invalid token', () => {
    return expect(createUpload('invalid')).rejects.toEqual(new Error('{"error":"Unauthorized","statusCode":401}'));
  });

  test('Upload file expired token', () => {
    const token = new UploadToken({
      accountId: Id.clear(1),
      expiresAt: new Date('2025-10-01T10:00:00.000Z'),
      videoId: Id.clear(1),
    }).encrypt();

    return expect(createUpload(token)).rejects.toEqual(new Error('{"error":"Gone","statusCode":410}'));
  });

  test('Upload file', async () => {
    const videoId = Id.clear(1);

    const token = new UploadToken({
      accountId: Id.clear(1),
      expiresAt: new Date('2025-10-01T10:01:00.000Z'),
      videoId,
    }).encrypt();

    const queue = await fixture.queue(QueueExchange.Media, QueueTask.Identify);

    const scope = nock('http://api.video.internal')
      .patch(`/v1/videos/${videoId.encrypted}/source`, {
        name: 'file.txt',
        size: 13,
        userId: '-Y5OWS2exwnMaKM-RWHDVg',
        key: token,
      })
      .reply(HttpStatus.NO_CONTENT);

    await expect(createUpload(token)).resolves.not.toThrow();

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(scope.isDone()).toBe(true);

    const uploadObject = await fixture.storage.getObject(StorageConstants.uploadsBucket, token);
    const uploadBuffer = await uploadObject?.body.toArray();
    expect(uploadBuffer?.toString()).toBe('Testing file\n');

    expect(queue.messages).toHaveLength(1);
    expect(queue.messages[0]).toEqual({ key: token });
    await queue.destroy();
  });
});
