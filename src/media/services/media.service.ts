import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';

@Injectable()
export class MediaService {
  getLocalFile(path: string): string {
    if (!existsSync(path)) throw new NotFoundException('image not found');
    return readFileSync(path).toString('base64');
  }
}
