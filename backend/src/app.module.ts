import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SubtitlesModule } from 'src/subtitles/subtitles.module';

@Module({
  imports: [SubtitlesModule],
  controllers: [AppController],
})
export class AppModule {}
