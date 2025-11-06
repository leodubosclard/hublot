import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { YoutubeDto } from 'src/tiktok/dto/youtube.dto';
import YoutubeService from 'src/tiktok/services/youtube.service';
import * as fs from 'fs';
import { join } from 'path';

@Controller('tiktok')
export class TiktokController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('youtube')
  async generateFromYoutube(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: YoutubeDto,
  ) {
    const zipPath = await this.youtubeService.generateVideo(
      req['user'].id,
      body.url,
      body.splitDuration,
      body.customText,
    );
    const fileStream = fs.createReadStream(join(process.cwd(), zipPath));

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=final.zip');

    fileStream.pipe(res);
  }
}
