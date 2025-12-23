import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

import { UploadResumableService } from './upload-resumable.service';
import { UploadSimpleService } from './upload-simple.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadResumableService: UploadResumableService,
    private readonly uploadSimpleService: UploadSimpleService,
  ) {}

  @Post('video/resumable/:token')
  public async resumable(@Req() req: Request, @Res() res: Response, @Param('token') token: string): Promise<void> {
    await this.uploadResumableService.handleUpload(req, res, token);
  }

  @Patch('video/resumable/:token')
  public async resumableChunk(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.uploadResumableService.handleUploadChunk(req, res);
  }

  @Post('video/simple/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  public async simple(@UploadedFile() file: Express.Multer.File, @Param('token') token: string): Promise<void> {
    await this.uploadSimpleService.handleUpload(file, token);
  }
}
