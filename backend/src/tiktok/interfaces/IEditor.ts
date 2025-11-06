/* eslint-disable @typescript-eslint/no-explicit-any */
interface IEditor {
  /**
   * @brief Split a video into a multiple videos of the same duration
   * @param args
   * @return void
   */
  splitVideo(
    originalDuration: number,
    videoPath: string,
    outputPath: string,
    splitDuration: number,
    customText?: string,
  ): Promise<void>;

  /**
   * @brief Overlay a video with an audio and save it with the good format and black padding
   *
   * @param videoPath
   * @param audioPath
   * @param outputPath
   * @return string
   */
  overlayVideo(
    videoPath: string,
    audioPath: string | null,
    outputPath: string,
  ): Promise<string>;

  /**
   * @brief Manage the creation of a video (call overlay, split, etc.)
   *
   * @param args
   * @return string
   */
  manageVideoCreation(...args: any[]): Promise<string>;

  /*
   * @brief Generate a video with the given arguments
   *
   * @param args
   * @return string
   */
  generateVideo(...args: any[]): Promise<string>;
}

export default IEditor;
