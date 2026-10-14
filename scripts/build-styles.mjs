import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transform } from 'esbuild';

export async function buildStyles(root, output) {
  const names = ['style.css', 'career.css', 'mila-player.css', 'project.css', 'work.css'];
  const sources = await Promise.all(names.map(name => readFile(path.join(root, name), 'utf8')));
  const combined = sources.join('\n');
  const relative = combined.replace(/url\((['"]?)\.\//g, 'url($1../');
  const result = await transform(relative, { loader: 'css', minify: true, target: 'es2022' });
  const hash = createHash('sha256').update(result.code).digest('hex').slice(0, 16);
  const name = `styles-${hash}.css`;
  const target = path.join(output, name);
  await writeFile(target, result.code);
  const loaderPath = path.join(root, 'loading.css');
  const loader = await readFile(loaderPath, 'utf8');
  return `<!-- styles-bundle -->\n  <style id="loading-styles">${loader.trim()}</style>\n  <link rel="stylesheet" href="./bundles/${name}">\n  <!-- /styles-bundle -->`;
}
