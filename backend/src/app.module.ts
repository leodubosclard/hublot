import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from 'src/cron/cron.module';
import { SubtitlesModule } from 'src/subtitles/subtitles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CronModule,
    SubtitlesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
