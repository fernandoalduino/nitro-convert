#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { nitroToJson, jsonToNitro, NitroJson } from './core/converter';

function main(): void {
  const [, , input, output] = process.argv;

  if (!input || !output) {
    console.error('Usage: nitro-convert <input> <output>');
    console.error('  nitro-convert room.nitro room.json');
    console.error('  nitro-convert room.json room.nitro');
    process.exit(1);
  }

  const inExt = extname(input).toLowerCase();
  const outExt = extname(output).toLowerCase();

  if (inExt === '.nitro' && outExt === '.json') {
    const result = nitroToJson(readFileSync(input));
    writeFileSync(output, JSON.stringify(result, null, 2));
  } else if (inExt === '.json' && outExt === '.nitro') {
    const json = JSON.parse(readFileSync(input, 'utf8')) as NitroJson;
    writeFileSync(output, jsonToNitro(json));
  } else {
    console.error('Unsupported conversion. Use .nitro -> .json or .json -> .nitro');
    process.exit(1);
  }

  console.log(`✓ Converted ${input} -> ${output}`);
}

main();