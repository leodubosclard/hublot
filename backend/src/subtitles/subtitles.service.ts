import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Lang, langLabels } from './types/lang.type';
import { appConstants, openaiConstants } from 'src/utils/environment';

@Injectable()
export class SubtitlesService {
  private readonly openai = new OpenAI({ apiKey: openaiConstants.apiKey });

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
    concurrency = 60,
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

  async translateSRT(buffer: Buffer, from: Lang, to: Lang): Promise<Buffer> {
    const content = buffer.toString('utf-8');
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

  async translateWholeSRT(
    buffer: Buffer,
    from: Lang,
    to: Lang,
  ): Promise<Buffer> {
    const content = buffer.toString('utf-8');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un traducteur professionnel de sous-titres.
          Traduis ce fichier SRT entier du ${langLabels[from]} vers le ${langLabels[to]}.
          Ne modifie pas la structure, garde les numéros et les timestamps inchangés.
          Ne supprime rien, ne rajoute rien, traduis uniquement le texte parlé.`,
        },
        { role: 'user', content },
      ],
      temperature: 0,
    });

    if (appConstants.isDevelopment) {
      const usage = response.usage;
      if (usage) {
        const inputCost = (usage.prompt_tokens * 0.00015) / 1000;
        const outputCost = (usage.completion_tokens * 0.0006) / 1000;
        const totalCost = inputCost + outputCost;

        console.log(`💰 Estimated cost : $${totalCost.toFixed(4)}`);
      }
    }

    const translated = response.choices[0].message.content.trim();
    return Buffer.from(translated, 'utf-8');
  }
}
