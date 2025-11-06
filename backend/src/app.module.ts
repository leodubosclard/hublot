import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from 'src/cron/cron.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CronModule],
  controllers: [AppController],
})
export class AppModule {}
