import { Lang } from 'src/subtitles/types/lang.type';

export class TranslateDto {
  from: Lang;
  to: Lang;
  filename?: string;
}
