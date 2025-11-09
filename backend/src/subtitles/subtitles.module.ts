import { Module } from '@nestjs/common';
import { SubtitlesController } from 'src/subtitles/subtitles.controller';
import { SubtitlesService } from 'src/subtitles/subtitles.service';

@Module({
  controllers: [SubtitlesController],
  providers: [SubtitlesService],
})
export class SubtitlesModule {}
