import { All, Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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

  @All('resumable')
  public async resumable(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.uploadResumableService.handleUpload(req, res);
  }

  @All('resumable/*splat')
  public async resumablePart(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.uploadResumableService.handleUpload(req, res);
  }

  @Post('simple')
  @UseInterceptors(FileInterceptor('file'))
  public async simple(@UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.uploadSimpleService.handleUpload(file);
  }
}
