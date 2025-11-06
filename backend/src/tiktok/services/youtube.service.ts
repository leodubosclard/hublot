import { Injectable } from '@nestjs/common';
import * as ytdl from '@distube/ytdl-core';
import * as fs from 'fs';
import AEditor from '../interfaces/AEditor';
import { execSync } from 'child_process';

@Injectable()
class YoutubeService extends AEditor {
  async _downloadVideo(url: string): Promise<string> {
    const info = await ytdl.getInfo(url);
    const outputFormat = ytdl.chooseFormat(info.formats, {
      filter: 'audioandvideo',
      quality: 'highest',
    });
    const outputVideoPath = `${info.videoDetails.title}.mp4`;

    return new Promise((resolve, reject) => {
      const stream = ytdl(url, { format: outputFormat });
      const file = fs.createWriteStream(outputVideoPath);

      stream.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(outputVideoPath);
      });

      file.on('error', (error) => {
        reject(error);
      });
    });
  }

  async manageVideoCreation(
    userId: string,
    videoUrl: string,
    videoPath: string,
    splitDuration: number,
    customText?: string,
  ): Promise<string> {
    const info = await ytdl.getInfo(videoUrl);
    const videoTitle = info.videoDetails.title;
    const outputPath = `${this._outputFolder}/${userId}/${videoTitle}`;
    const originalDuration = parseInt(info.videoDetails.lengthSeconds);

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const overlayPath = await this.overlayVideo(videoPath, null, outputPath);

    if (splitDuration > 0) {
      await this.splitVideo(
        originalDuration,
        overlayPath,
        outputPath,
        splitDuration,
        customText,
      );
      fs.unlinkSync(overlayPath);
    }

    execSync(`cd "${outputPath}" && zip -r "../${videoTitle}.zip" *.mp4`);
    fs.rmSync(outputPath, { recursive: true });

    return `${outputPath.split('/').slice(0, -1).join('/')}/${videoTitle}.zip`;
  }

  async generateVideo(
    userId: string,
    url: string,
    splitDuration: number,
    customText?: string,
  ): Promise<string> {
    let outputPath = '';

    try {
      // Download sources
      const videoPath = await this._downloadVideo(url);

      if (!fs.existsSync(this._outputFolder)) {
        fs.mkdirSync(this._outputFolder);
      }

      outputPath = await this.manageVideoCreation(
        userId,
        url,
        videoPath,
        splitDuration,
        customText,
      );
      fs.unlinkSync(videoPath);
    } catch (error) {
      console.error('Error during video generation. Error=', error);
    }

    return outputPath;
  }
}

export default YoutubeService;
