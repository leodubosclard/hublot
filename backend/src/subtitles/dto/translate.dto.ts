import { Lang } from '../types/lang.type';

export class TranslateDto {
  from: Lang;
  to: Lang;
  filename?: string;
}
