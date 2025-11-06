import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class YoutubeDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsPositive()
  splitDuration: number;

  @IsString()
  customText?: string;
}
