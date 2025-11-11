import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SubtitlesModule } from './subtitles/subtitles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SubtitlesModule],
  controllers: [AppController],
})
export class AppModule {}
