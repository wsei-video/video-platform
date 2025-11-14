import fs from 'fs';

export class HlsSegmentEncoder {
  /** Patches the .m4s segment file header to place it in the specified position on the video timeline. */
  public static rebaseSegment(filepath: string, sequenceNumber: number, startTime: number): void {
    const addrSidxEarliestPresentationTime = 0x30;
    const addrMfhdSequenceNumber = 0x60;
    const addrTfhdBaseMediaDecodeTime = 0x98;

    const fd = fs.openSync(filepath, 'r+');
    this.writeUInt32BE(fd, startTime, addrSidxEarliestPresentationTime);
    this.writeUInt32BE(fd, sequenceNumber, addrMfhdSequenceNumber);
    this.writeUInt32BE(fd, startTime, addrTfhdBaseMediaDecodeTime);
    fs.closeSync(fd);
  }

  /** Writes 4-byte unsigned integer into the file on the give offset. */
  private static writeUInt32BE(fd: number, value: number, offset: number): void {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32BE(value);
    fs.writeSync(fd, buffer, 0, 4, offset);
  }
}
