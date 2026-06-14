import { inflateSync, deflateSync } from 'zlib';
import { BinaryReader } from '../binary/BinaryReader';
import { BinaryWriter } from '../binary/BinaryWriter';

export class NitroBundle {
  private readonly files = new Map<string, Buffer>();

  static fromBuffer(buffer: Buffer): NitroBundle {
    const bundle = new NitroBundle();
    const reader = new BinaryReader(buffer);

    let fileCount = reader.readShort();
    while (fileCount > 0) {
      const nameLength = reader.readShort();
      const fileName = reader.readBytes(nameLength).toString('utf8');
      const dataLength = reader.readInt();
      const compressed = reader.readBytes(dataLength);
      bundle.files.set(fileName, inflateSync(compressed));
      fileCount--;
    }
    return bundle;
  }

  toBuffer(): Buffer {
    const writer = new BinaryWriter();
    writer.writeShort(this.files.size);

    for (const [name, data] of this.files) {
      const nameBuffer = Buffer.from(name, 'utf8');
      const compressed = deflateSync(data);
      writer
        .writeShort(nameBuffer.length)
        .writeBytes(nameBuffer)
        .writeInt(compressed.length)
        .writeBytes(compressed);
    }
    return writer.toBuffer();
  }

  addFile(name: string, data: Buffer): void {
    this.files.set(name, data);
  }

  getFiles(): Map<string, Buffer> {
    return this.files;
  }
}