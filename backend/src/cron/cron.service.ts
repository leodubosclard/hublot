import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CronService {
  /**
   * @description Fetch data to keep alive World of Scans database
   * @cron Every day at 10AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async refreshWosDb() {
    console.log('[CronService] Refreshing WOS DB');
    const wosUrl = process.env.WOS_URL;
    const wosId = process.env.WOS_ID;

    if (!wosUrl || !wosId) {
      console.error('WOS_URL or WOS_ID is missing.');
      return;
    }

    const res = await axios.get(
      `${process.env.WOS_URL}/entity/${process.env.WOS_ID}`,
    );
    console.log(
      `${res.status === 200 ? '✅' : '❌'} ${res.status} - ${res.statusText}`,
    );
  }
}
