import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Lang, langLabels } from 'src/subtitles/types/lang.type';
import * as fs from 'fs-extra';

@Injectable()
export class SubtitlesService {
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  private async translateLine(
    line: string,
    from: Lang,
    to: Lang,
  ): Promise<string> {
    if (!line.trim()) return '';

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Tu es un traducteur professionnel de sous-titres. Traduis ce texte de ${langLabels[from]} vers ${langLabels[to]} sans changer le sens.`,
          },
          { role: 'user', content: line },
        ],
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error translating line:', error);
      return line;
    }
  }

  private async promisePool<T>(
    items: T[],
    worker: (item: T, index: number) => Promise<any>,
    concurrency = 20,
  ): Promise<any[]> {
    const results: any[] = [];
    let i = 0;

    const execute = async () => {
      while (i < items.length) {
        const currentIndex = i++;
        results[currentIndex] = await worker(items[currentIndex], currentIndex);
      }
    };

    const workers = Array.from({ length: concurrency }, () => execute());
    await Promise.all(workers);
    return results;
  }

  async translateSRT(filePath: string, from: Lang, to: Lang): Promise<Buffer> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const translatedLines: string[] = [...lines];

    const textLines = lines.map((line, idx) => ({
      line,
      index: idx,
      translate:
        !Number.isInteger(Number(line)) &&
        !line.includes('-->') &&
        line.trim() !== '',
    }));

    const worker = async (item: (typeof textLines)[0]) => {
      if (!item.translate) return item.line;
      return await this.translateLine(item.line, from, to);
    };

    const results = await this.promisePool(textLines, worker, 5);

    results.forEach((line, idx) => {
      translatedLines[idx] = line;
    });

    return Buffer.from(translatedLines.join('\n'), 'utf-8');
  }
}
