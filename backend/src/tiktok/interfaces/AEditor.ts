/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { execSync } from 'child_process';
import IEditor from './IEditor';

abstract class AEditor implements IEditor {
  protected _outputFolder = 'output';

  async splitVideo(
    originalDuration: number,
    videoPath: string,
    outputPath: string,
    splitDuration: number,
    customText = 'Partie $SPLIT',
  ): Promise<void> {
    for (
      let duration = 0;
      duration < originalDuration;
      duration += splitDuration
    ) {
      const splitNb = Math.floor(duration / splitDuration) + 1;
      const tmpOutputPath = `${outputPath}/tmp_segment_${splitNb}.mp4`;
      const finalOutputPath = `${outputPath}/segment_${splitNb}.mp4`;

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(videoPath)
          .videoCodec('libx264')
          .audioCodec('copy')
          .outputOptions('-strict experimental')
          .outputOptions(`-ss ${duration}`)
          .outputOptions(`-t ${splitDuration}`)
          .save(tmpOutputPath)
          .on('end', () => {
            // eslint-disable-next-line prettier/prettier
            execSync(`ffmpeg -y -i '${tmpOutputPath}' -vf "drawtext=text='${customText.replace('$SPLIT', splitNb.toString())}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=(h-text_h-line_h)/4" -c:a copy '${finalOutputPath}'`);
            fs.unlinkSync(tmpOutputPath);
            console.log(`Split ${splitNb} done.`);
            resolve('done');
          })
          .on('error', (error) => {
            console.error('Error during split. Error=', error);
            reject(error);
          });
      });
    }
  }

  async overlayVideo(
    videoPath: string,
    audioPath: string | null,
    outputPath: string,
  ): Promise<string> {
    const overlayOutputPath = `${outputPath}/overlay.mp4`;

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoPath)
        // .input(audioPath)
        // .audioCodec('aac')
        .size('720x1280')
        .autopad(true, 'black')
        .save(overlayOutputPath)
        .on('end', () => {
          console.log('Overlay done.');
          resolve(overlayOutputPath);
        })
        .on('error', (error) => {
          console.error('Error during overlay. Error=', error);
          reject(error);
        });
    });
  }

  abstract manageVideoCreation(...args: any[]): Promise<string>;

  abstract generateVideo(...args: any[]): Promise<string>;
}

export default AEditor;
