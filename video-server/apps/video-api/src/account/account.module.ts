import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account.controller';

@Module({
  controllers: [AccountController],
  imports: [DatabaseModule, AuthModule],
})
export class AccountModule {}
