import fs from 'fs/promises';
import path from 'path';

export class FileUtils {
  public static async listFiles(directory: string): Promise<string[]> {
    const files = await fs.readdir(directory);
    const fileList: string[] = [];

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = await fs.stat(fullPath);
      if (stat.isFile()) fileList.push(file);
    }

    return fileList;
  }
}
