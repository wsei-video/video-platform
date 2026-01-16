/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpStatus } from '@nestjs/common';

import { DateUtils } from '@video/lib/utils';
import { Id } from '@video/lib/restful';

import { TestingAuth, TestingFixture } from './testing/fixture';

describe('Search', () => {
  let fixture: TestingFixture;
  let auth: TestingAuth;

  beforeEach(async () => {
    fixture = await TestingFixture.create();
    auth = await fixture.createAuth();

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

    const channelId = Id.clear(myChannel.id).encrypted;

    // Create testing videos

    await fixture
      .request()
      .post('/v1/videos')
      .set('Authorization', auth.header)
      .send({
        channelId,
        title: 'The Hunger Games',
        description:
          "Katniss decides to take her sister's place in the Hunger Games, a televised reality competition, where " +
          'young contestants must fight each other to death and the only survivor is crowned as the winner.',
      })
      .expect(HttpStatus.CREATED);

    await fixture
      .request()
      .post('/v1/videos')
      .set('Authorization', auth.header)
      .send({
        channelId,
        title: 'The Maze Runner',
        description:
          'Thomas loses his memory and finds himself trapped in a massive maze called the Glade. He and his friends ' +
          'try to escape from the maze and eventually learn that they are subjects of an experiment.',
      })
      .expect(HttpStatus.CREATED);

    await fixture
      .request()
      .post('/v1/videos')
      .set('Authorization', auth.header)
      .send({
        channelId,
        title: 'Breaking Bad',
        description:
          'Walter White, a chemistry teacher, discovers that he has cancer and decides to get into the meth-making ' +
          'business to repay his medical debts. His priorities begin to change when he partners with Jesse.',
      })
      .expect(HttpStatus.CREATED);

    await fixture.waitForSearchIndexingCompleted();
  });

  afterEach(() => fixture.destroy());

  test('Search no phrase', () => {
    return fixture
      .request()
      .get('/v1/search')
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        error: 'BadRequest',
        statusCode: 400,
        reason: { name: 'InvalidQuery', issues: { phrase: ['minLength', 'isString'] } },
      });
  });

  test('Search empty phrase', () => {
    return fixture
      .request()
      .get('/v1/search?phrase=')
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        error: 'BadRequest',
        statusCode: 400,
        reason: { name: 'InvalidQuery', issues: { phrase: ['minLength'] } },
      });
  });

  test('Search in title exact', () => {
    return fixture
      .request()
      .get('/v1/search?phrase=Hunger')
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.body.total).toBe(1);
        expect(response.body.next).toBe(false);
        expect(response.body.items.map((item: { title: any }) => item.title)).toEqual(['The Hunger Games']);
      });
  });

  test('Search in title fuzzy', () => {
    return fixture
      .request()
      .get('/v1/search?phrase=runer')
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.body.total).toBe(1);
        expect(response.body.next).toBe(false);
        expect(response.body.items.map((item: { title: any }) => item.title)).toEqual(['The Maze Runner']);
      });
  });

  test('Search in description exact', () => {
    return fixture
      .request()
      .get('/v1/search?phrase=teacher')
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.body.total).toBe(1);
        expect(response.body.next).toBe(false);
        expect(response.body.items.map((item: { title: any }) => item.title)).toEqual(['Breaking Bad']);
      });
  });

  test('Search in description fuzzy', () => {
    return fixture
      .request()
      .get('/v1/search?phrase=syster')
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.body.total).toBe(1);
        expect(response.body.next).toBe(false);
        expect(response.body.items.map((item: { title: any }) => item.title)).toEqual(['The Hunger Games']);
      });
  });

  test('Relevance order', () => {
    return fixture
      .request()
      .get('/v1/search?phrase=The Maze')
      .expect(HttpStatus.OK)
      .expect(response => {
        expect(response.body.total).toBe(3);
        expect(response.body.next).toBe(false);
        expect(response.body.items.map((item: { title: any }) => item.title)).toEqual([
          'The Maze Runner', // Exact in title at the top
          'The Hunger Games', // "The" in title - some relevance
          'Breaking Bad', // "The" in description - least relevant
        ]);
      });
  });
});
