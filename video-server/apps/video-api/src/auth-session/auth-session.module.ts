import { Module } from '@nestjs/common';

import { DatabaseModule } from '@video/lib/database';

import { AuthModule } from '../auth/auth.module';
import { AuthSessionController } from './auth-session.controller';

@Module({
  controllers: [AuthSessionController],
  imports: [DatabaseModule, AuthModule],
})
export class AuthSessionModule {}
