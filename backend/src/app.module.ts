import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TiktokModule } from 'src/tiktok/tiktok.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TiktokModule],
  controllers: [AppController],
})
export class AppModule {}
