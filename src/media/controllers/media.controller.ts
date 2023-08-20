import { Controller, Get, HttpCode, Param, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { MediaService } from '../services/media.service';
import { existsSync } from 'fs';

@Controller('media')
@ApiTags('Media')
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('profileImage/:file')
  @HttpCode(200)
  @ApiParam({
    name: 'file',
    description: 'file name with extension',
  })
  public showUserProfileImages(
    @Param('file') file: string,
    @Res() res: Response,
  ): any {
    const pathFile = `storage/uploads/${file}`;
    if (!existsSync(pathFile)) return res.send('not found');
    const fullPath = __dirname.replace('dist/media/controllers', '') + pathFile;
    return res.sendFile(fullPath);
  }
}
