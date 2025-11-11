import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubtitlesService } from 'src/subtitles/subtitles.service';
import { TranslateDto } from 'src/subtitles/dto/translate.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('subtitles')
export class SubtitlesController {
  constructor(private readonly subtitlesService: SubtitlesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async translate(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: TranslateDto,
    @Res() res: Response,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!body.from || !body.to)
      throw new BadRequestException('Missing from or to language');

    const translatedBuffer = await this.subtitlesService.translateSRT(
      file.buffer,
      body.from,
      body.to,
    );

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="translated_to_${body.to}_${file.originalname}"`,
    });
    res.send(translatedBuffer);
  }
}
