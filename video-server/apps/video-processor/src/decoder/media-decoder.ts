import { execFile } from 'child_process';
import { promisify } from 'util';

import { MediaProbe } from './media-decoder.types';

const execFileAsync = promisify(execFile);

export class MediaDecoder {
  public async probe(filepath: string): Promise<MediaProbe> {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v',
      'error',
      '-print_format',
      'json',
      '-show_format',
      '-show_streams',
      '-show_data',
      filepath,
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(stdout);
  }
}
