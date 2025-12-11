import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { DatabaseService } from '@video/lib/database';

import { AppModule } from '../../src/app.module';
import { configureApplication } from '../../src/app.config';
import { DateUtils } from '@video/lib/utils';

export class TestingFixture {
  public readonly database: DatabaseService;
  public readonly dateSpy: jest.SpyInstance;

  private constructor(
    public readonly app: NestExpressApplication,
    public readonly module: TestingModule,
  ) {
    this.database = app.get(DatabaseService);
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
}
