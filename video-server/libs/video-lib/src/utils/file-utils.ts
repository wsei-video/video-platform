import fs from 'fs/promises';
import path from 'path';

export class FileUtils {
  public static async listFiles(directory: string): Promise<FileStat[]> {
    const files = await fs.readdir(directory);
    const fileList: FileStat[] = [];

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = await fs.stat(fullPath);
      if (stat.isFile()) fileList.push({ name: file, size: stat.size });
    }

    return fileList;
  }
}

export interface FileStat {
  name: string;
  size: number;
}
