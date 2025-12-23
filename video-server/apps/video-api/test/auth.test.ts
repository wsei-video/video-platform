import { HttpStatus } from '@nestjs/common';

import { AccessToken } from '@video/lib/token';
import { Account, AuthSession } from '@video/lib/database/client';
import { DateUtils } from '@video/lib/utils';
import { Hasher } from '@video/lib/crypto';
import { Id } from '@video/lib/restful';

import { TestingFixture } from './testing/fixture';

describe('Auth', () => {
  let fixture: TestingFixture;

  beforeEach(async () => (fixture = await TestingFixture.create()));

  afterEach(() => fixture.destroy());

  test('Get current account when unauthenticated', () => {
    return fixture
      .request()
      .get('/v1/account')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ error: 'Unauthorized', statusCode: 401 });
  });

  test('Get current account invalid header', () => {
    return fixture
      .request()
      .get('/v1/account')
      .set('Authorization', 'Basic invalid')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ error: 'Unauthorized', statusCode: 401 });
  });

  test('Get current account invalid token', () => {
    return fixture
      .request()
      .get('/v1/account')
      .set('Authorization', 'Bearer invalid')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ error: 'Unauthorized', statusCode: 401 });
  });

  test('Get current session when unauthenticated', () => {
    return fixture
      .request()
      .get('/v1/auth')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ error: 'Unauthorized', statusCode: 401 });
  });

  test('Logout when unauthenticated', () => {
    return fixture
      .request()
      .delete('/v1/auth/session')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ error: 'Unauthorized', statusCode: 401 });
  });

  test('List sessions when unauthenticated', () => {
    return fixture
      .request()
      .get('/v1/auth/sessions')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ error: 'Unauthorized', statusCode: 401 });
  });

  test('Register with invalid body', () => {
    return fixture
      .request()
      .post('/v1/account')
      .send({ email: 'invalid', password: '', name: '' })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        error: 'BadRequest',
        statusCode: 400,
        reason: {
          name: 'InvalidBody',
          issues: {
            email: ['isEmail'],
            password: ['minLength'],
            name: ['minLength'],
          },
        },
      });
  });

  test('Register on Windows 10 Chrome', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/135.0.0.0 Safari/537.36';

    return fixture
      .request()
      .post('/v1/account')
      .set('user-agent', userAgent)
      .send({ email: 'john@example.com', password: 'password1', name: 'John Doe' })
      .expect(HttpStatus.CREATED)
      .expect({
        account: {
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          email: 'john@example.com',
          name: 'John Doe',
          createdAt: '2025-10-01T10:00:00.000Z',
        },
        session: {
          id: '-Y5OWS2exwnMaKM-RWHDVg',
          device: 'Windows 10',
          browser: 'Chrome',
          lastAccessAt: '2025-10-01T10:00:00.000Z',
          createdAt: '2025-10-01T10:00:00.000Z',
        },
        accessToken: 'LxnUKhdhQrZ02-iSQpazRGBtc7E1S9bPVyeGNZbwLtE',
      });
  });

  describe('Existing account', () => {
    let account: Account;

    beforeEach(async () => {
      const passwordHash = await Hasher.hash('password1');

      account = await fixture.database.account.create({
        data: { email: 'john@example.com', name: 'John Doe', passwordHash, createdAt: DateUtils.now() },
      });
    });

    test('Register email taken', () => {
      return fixture
        .request()
        .post('/v1/account')
        .send({ email: 'john@example.com', password: 'password1', name: 'John Doe' })
        .expect(HttpStatus.CONFLICT)
        .expect({ error: 'Conflict', statusCode: 409, reason: { name: 'EmailAlreadyExists', resource: 'Account' } });
    });

    test('Login with empty body', () => {
      return fixture
        .request()
        .post('/v1/auth/sessions')
        .send()
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          error: 'BadRequest',
          statusCode: 400,
          reason: {
            name: 'InvalidBody',
            issues: {
              email: ['isEmail'],
              password: ['isString'],
            },
          },
        });
    });

    test('Login with invalid password', () => {
      return fixture
        .request()
        .post('/v1/auth/sessions')
        .send({ email: 'john@example.com', password: 'invalid' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ error: 'BadRequest', statusCode: 400, reason: { name: 'InvalidCredentials' } });
    });

    test('Login with invalid email', () => {
      return fixture
        .request()
        .post('/v1/auth/sessions')
        .send({ email: 'anna@example.com', password: 'password1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ error: 'BadRequest', statusCode: 400, reason: { name: 'InvalidCredentials' } });
    });

    test('Login with valid email and password', () => {
      return fixture
        .request()
        .post('/v1/auth/sessions')
        .send({ email: 'john@example.com', password: 'password1' })
        .expect(HttpStatus.CREATED)
        .expect({
          account: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            email: 'john@example.com',
            name: 'John Doe',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
          session: {
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            device: null,
            browser: null,
            lastAccessAt: '2025-10-01T10:00:00.000Z',
            createdAt: '2025-10-01T10:00:00.000Z',
          },
          accessToken: 'LxnUKhdhQrZ02-iSQpazRGBtc7E1S9bPVyeGNZbwLtE',
        });
    });

    describe('Existing session', () => {
      let session: AuthSession;
      let sessionId: string;
      let accessToken: string;

      beforeEach(async () => {
        session = await fixture.database.authSession.create({
          data: { accountId: account.id, lastAccessAt: DateUtils.now(), createdAt: DateUtils.now() },
        });
        sessionId = Id.clear(session.id).encrypted;
        accessToken = new AccessToken({ accountId: session.accountId, sessionId: session.id }).encrypt();
      });

      test('Get current account', () => {
        return fixture
          .request()
          .get('/v1/account')
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect({
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            email: 'john@example.com',
            name: 'John Doe',
            createdAt: '2025-10-01T10:00:00.000Z',
          });
      });

      test('Get current auth', () => {
        fixture.dateSpy.mockReturnValue(new Date('2025-12-10T14:30:00.000Z'));

        return fixture
          .request()
          .get('/v1/auth')
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect({
            account: {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              email: 'john@example.com',
              name: 'John Doe',
              createdAt: '2025-10-01T10:00:00.000Z',
            },
            session: {
              id: '-Y5OWS2exwnMaKM-RWHDVg',
              device: null,
              browser: null,
              lastAccessAt: '2025-12-10T14:30:00.000Z',
              createdAt: '2025-10-01T10:00:00.000Z',
            },
            accessToken: 'LxnUKhdhQrZ02-iSQpazRGBtc7E1S9bPVyeGNZbwLtE',
          });
      });

      test('List sessions', () => {
        return fixture
          .request()
          .get('/v1/auth/sessions')
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect({
            total: 1,
            next: false,
            items: [
              {
                id: '-Y5OWS2exwnMaKM-RWHDVg',
                device: null,
                browser: null,
                lastAccessAt: '2025-10-01T10:00:00.000Z',
                createdAt: '2025-10-01T10:00:00.000Z',
              },
            ],
          });
      });

      test('Get session', () => {
        return fixture
          .request()
          .get(`/v1/auth/sessions/${sessionId}`)
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.OK)
          .expect({
            id: '-Y5OWS2exwnMaKM-RWHDVg',
            device: null,
            browser: null,
            lastAccessAt: '2025-10-01T10:00:00.000Z',
            createdAt: '2025-10-01T10:00:00.000Z',
          });
      });

      test('Get session invalid id', () => {
        return fixture
          .request()
          .get('/v1/auth/sessions/invalid')
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.BAD_REQUEST)
          .expect({ error: 'BadRequest', statusCode: 400, reason: { name: 'InvalidId' } });
      });

      test('Get session not found', () => {
        return fixture
          .request()
          .get(`/v1/auth/sessions/${Id.clear(0).encrypted}`)
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND)
          .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'AuthSession' } });
      });

      test('Logout', async () => {
        await fixture
          .request()
          .delete('/v1/auth/session')
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NO_CONTENT)
          .expect('');

        await fixture
          .request()
          .delete('/v1/auth/session')
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.UNAUTHORIZED)
          .expect({ error: 'Unauthorized', statusCode: 401 });
      });

      test('Delete session when unauthenticated', () => {
        return fixture
          .request()
          .delete(`/v1/auth/sessions/${sessionId}`)
          .send()
          .expect(HttpStatus.UNAUTHORIZED)
          .expect({ error: 'Unauthorized', statusCode: 401 });
      });

      test('Delete session not found', () => {
        return fixture
          .request()
          .delete(`/v1/auth/sessions/${Id.clear(0).encrypted}`)
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NOT_FOUND)
          .expect({ error: 'NotFound', statusCode: 404, reason: { resource: 'AuthSession' } });
      });

      test('Delete session', async () => {
        await fixture
          .request()
          .delete(`/v1/auth/sessions/${sessionId}`)
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.NO_CONTENT)
          .expect('');

        await fixture
          .request()
          .get('/v1/auth')
          .set('authorization', `Bearer ${accessToken}`)
          .send()
          .expect(HttpStatus.UNAUTHORIZED)
          .expect({ error: 'Unauthorized', statusCode: 401 });
      });
    });
  });
});
