import { Module } from '@nestjs/common';
import { MediaService } from './services/media.service';
import { MediaController } from './controllers/media.controller';

@Module({
  imports: [],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
