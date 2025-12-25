import { Mock, vi } from 'vitest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { DateUtils } from '@video/lib/utils';
import { StorageService } from '@video/lib/storage';

import { CdnModule } from '../../src/cdn.module';
import { configureApplication } from '../../src/app.config';

export class TestingFixture {
  public readonly storage: StorageService;
  public readonly dateSpy: Mock<() => Date>;

  private constructor(
    public readonly app: NestExpressApplication,
    public readonly module: TestingModule,
  ) {
    this.storage = app.get(StorageService);
    this.dateSpy = vi.spyOn(DateUtils, 'now').mockReturnValue(new Date('2025-10-01T10:00:00.000Z'));
  }

  public static async create() {
    const builder = Test.createTestingModule({ imports: [CdnModule] });
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
