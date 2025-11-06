import { Module } from '@nestjs/common';
import YoutubeService from 'src/tiktok/services/youtube.service';
import { TiktokController } from 'src/tiktok/tiktok.controller';

@Module({
  controllers: [TiktokController],
  providers: [YoutubeService],
})
export class TiktokModule {}
