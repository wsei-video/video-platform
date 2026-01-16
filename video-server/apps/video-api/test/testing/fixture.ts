import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AccessToken } from '@video/lib/token';
import { Account, AuthSession } from '@video/lib/database/client';
import { Config } from '@video/lib/config';
import { DatabaseService } from '@video/lib/database';
import { DateUtils } from '@video/lib/utils';
import { Hasher } from '@video/lib/crypto';
import { MeiliSearchService } from '@video/lib/meili-search';

import { AppModule } from '../../src/app.module';
import { configureApplication } from '../../src/app.config';

export class TestingFixture {
  public readonly config: Config;
  public readonly database: DatabaseService;
  public readonly meiliSearch: MeiliSearchService;
  public readonly dateSpy: jest.SpyInstance;

  private constructor(
    public readonly app: NestExpressApplication,
    public readonly module: TestingModule,
  ) {
    this.config = app.get(Config);
    this.database = app.get(DatabaseService);
    this.meiliSearch = app.get(MeiliSearchService);
    this.dateSpy = jest.spyOn(DateUtils, 'now').mockReturnValue(new Date('2025-10-01T10:00:00.000Z'));
  }

  public static async create() {
    const builder = Test.createTestingModule({ imports: [AppModule] });
    const module = await builder.compile();
    const app = module.createNestApplication<NestExpressApplication>();
    configureApplication(app);
    await app.init();
    return new TestingFixture(app, module);
  }

  public async destroy() {
    await this.app.close();
  }

  public request() {
    return request(this.app.getHttpServer());
  }

  public async waitForSearchIndexingCompleted() {
    const tasks = await this.meiliSearch.tasks.getTasks();
    await this.meiliSearch.tasks.waitForTasks(tasks.results.map(task => task.uid));
  }

  public async createAuth(): Promise<TestingAuth> {
    const passwordHash = await Hasher.hash('password1');

    const account = await this.database.account.create({
      data: { email: 'john@example.com', name: 'John Doe', passwordHash, createdAt: DateUtils.now() },
    });

    const session = await this.database.authSession.create({
      data: { accountId: account.id, lastAccessAt: DateUtils.now(), createdAt: DateUtils.now() },
    });

    const accessToken = new AccessToken({ accountId: session.accountId, sessionId: session.id }).encrypt();

    return {
      accessToken,
      account,
      header: `Bearer ${accessToken}`,
      session,
    };
  }
}

export interface TestingAuth {
  accessToken: string;
  header: string;
  account: Account;
  session: AuthSession;
}
