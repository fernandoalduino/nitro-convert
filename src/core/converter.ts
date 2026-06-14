import { NitroBundle } from './NitroBundle';

export interface NitroJsonFile {
  encoding: 'json' | 'base64';
  data: unknown;
}

export interface NitroJson {
  __format: 'nitro-convert@1';
  files: Record<string, NitroJsonFile>;
}

const JSON_FILE = /\.json$/i;

export function nitroToJson(buffer: Buffer): NitroJson {
  const bundle = NitroBundle.fromBuffer(buffer);
  const files: Record<string, NitroJsonFile> = {};

  for (const [name, data] of bundle.getFiles()) {
    if (JSON_FILE.test(name)) {
      files[name] = { encoding: 'json', data: JSON.parse(data.toString('utf8')) };
    } else {
      files[name] = { encoding: 'base64', data: data.toString('base64') };
    }
  }
  return { __format: 'nitro-convert@1', files };
}

export function jsonToNitro(json: NitroJson): Buffer {
  const bundle = new NitroBundle();

  for (const [name, file] of Object.entries(json.files)) {
    const data =
      file.encoding === 'json'
        ? Buffer.from(JSON.stringify(file.data), 'utf8')
        : Buffer.from(file.data as string, 'base64');
    bundle.addFile(name, data);
  }
  return bundle.toBuffer();
}