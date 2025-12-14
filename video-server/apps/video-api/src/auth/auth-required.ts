import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from './auth.guard';

export const AuthRequired = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
