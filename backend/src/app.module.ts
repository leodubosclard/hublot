import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SubtitlesModule } from './subtitles/subtitles.module';

@Module({
  imports: [SubtitlesModule],
  controllers: [AppController],
})
export class AppModule {}
