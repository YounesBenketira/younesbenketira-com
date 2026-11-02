import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { brotliCompress, constants, gzip } from 'node:zlib';

const brotli = promisify(brotliCompress);
const compressGzip = promisify(gzip);

export async function buildCompression(output) {
  const files = await readdir(output);
  const names = files.filter(name => /\.(js|css|json)$/.test(name));
  for (const name of names) {
    const file = path.join(output, name);
    const source = await readFile(file);
    const [br, gz] = await Promise.all([
      brotli(source, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }),
      compressGzip(source, { level: 9 }),
    ]);
    await Promise.all([writeFile(`${file}.br`, br), writeFile(`${file}.gz`, gz)]);
  }
}
