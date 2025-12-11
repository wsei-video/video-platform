import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { Config } from '../config';
import { PrismaClient } from './prisma/client/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  public constructor(config: Config) {
    const adapter = new PrismaPg({ connectionString: config.database.url });
    super({ adapter });
  }
}
