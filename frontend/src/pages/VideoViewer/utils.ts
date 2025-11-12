/* eslint-disable no-useless-escape */

const TIMING_LINE_REGEX = /^\d{2}:\d{2}:\d{2}[,\.]\d{3} --> \d{2}:\d{2}:\d{2}[,\.]\d{3}/;

export const convertSrtToVtt = (srt: string): string => {
  const normalizedSrt = srt.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedSrt.split('\n');
  const vttLines: string[] = ['WEBVTT', ''];

  for (let i = 0; i < lines.length; i++) {
    if (TIMING_LINE_REGEX.test(lines[i])) {
      const timing = lines[i].replace(/,/g, '.');
      vttLines.push(timing);

      const subtitleLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== '') {
        subtitleLines.push(lines[j]);
        j++;
      }

      vttLines.push(...subtitleLines, '');
      i = j - 1;
    }
  }

  return vttLines.join('\n');
};
