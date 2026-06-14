# nitro-convert

A small CLI tool to convert **Habbo Nitro** `.nitro` bundles to/from JSON,
so any language or tool can read and edit Nitro asset data.

## Why
`.nitro` files are binary archives containing a JSON index plus one or more
zlib-compressed spritesheets. `nitro-convert` unpacks them into a single,
human-readable JSON (with binary assets as base64) and can repack them back
**losslessly**. Works for rooms, furni, figures, effects, pets: anything that
ships as a Nitro bundle.

## Install
```bash
npm install
npm run build
npm link   # optional: makes `nitro-convert` available globally
```

## Usage
```bash
nitro-convert room.nitro room.json   # unpack
nitro-convert room.json room.nitro   # repack
```
Direction is detected automatically from the file extensions.

## JSON format
```json
{
  "__format": "nitro-convert@1",
  "files": {
    "room.json": { "encoding": "json", "data": { } },
    "room_spritesheet.png": { "encoding": "base64", "data": "iVBORw0..." }
  }
}
```

## Nitro bundle binary layout
```text
uint16  fileCount               (big-endian)
repeat:
  uint16  fileNameLength
  bytes   fileName (utf-8)
  uint32  fileDataLength
  bytes   fileData              (zlib / deflate)
```

## License
MIT
