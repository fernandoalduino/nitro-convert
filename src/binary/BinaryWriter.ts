export class BinaryWriter {
  private readonly chunks: Buffer[] = [];

  writeShort(value: number): this {
    const buf = Buffer.alloc(2);
    buf.writeUInt16BE(value, 0);
    this.chunks.push(buf);
    return this;
  }

  writeInt(value: number): this {
    const buf = Buffer.alloc(4);
    buf.writeUInt32BE(value, 0);
    this.chunks.push(buf);
    return this;
  }

  writeBytes(buffer: Buffer): this {
    this.chunks.push(buffer);
    return this;
  }

  toBuffer(): Buffer {
    return Buffer.concat(this.chunks);
  }
}