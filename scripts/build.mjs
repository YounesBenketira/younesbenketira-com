import { build } from 'esbuild';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const output = path.join(root, 'bundles');
await mkdir(output, { recursive: true });
const previous = await readdir(output);
await Promise.all(previous.filter(name => /\.(js|css)$/.test(name)).map(name => unlink(path.join(output, name))));
const stoneSource = path.join(root, 'textures/ivory-limestone.png');
const stoneTarget = path.join(root, 'textures/ivory-limestone.webp');
await sharp(stoneSource).webp({ quality: 92, effort: 6 }).toFile(stoneTarget);
const logoSource = path.join(root, 'images/flighthub-icon-white.png');
const logoTarget = path.join(root, 'images/flighthub-icon-white.webp');
await sharp(logoSource).resize(240, 240).webp({ lossless: true }).toFile(logoTarget);
const font = await readFile(path.join(root, 'fonts/GreatVibes-Regular.ttf'));
const compressed = await wawoff2.compress(font);
await writeFile(path.join(root, 'fonts/GreatVibes-Regular.woff2'), compressed);
const options = {
  bundle: true, minify: true, format: 'esm', target: 'es2022', outdir: output,
  entryNames: '[name]-[hash]', chunkNames: 'chunk-[hash]', metafile: true,
  alias: { three: path.join(root, 'vendor/three.module.js') },
};
const worker = await build({ ...options, entryPoints: ['dist/city-worker.js'] });
const workerPath = Object.keys(worker.metafile.outputs).find(name => name.endsWith('.js'));
const workerURL = './bundles/' + path.basename(workerPath);
const app = await build({ ...options, entryPoints: ['dist/boot.js'], splitting: true,
  define: { CITY_WORKER_URL: JSON.stringify(workerURL) },
});
const bootPath = Object.entries(app.metafile.outputs).find(([, data]) => data.entryPoint === 'dist/boot.js')[0];
const htmlPath = path.join(root, 'index.html');
const html = await readFile(htmlPath, 'utf8');
const failure = "document.documentElement.classList.remove('is-loading');document.querySelector('#loading-screen').hidden=true;document.querySelector('#experience').classList.add('scene-failed');document.querySelector('#notice').textContent='The 3D view could not load. Reload to try again.'";
const script = `<!-- app-bundle -->\n  <script type="module" src="./bundles/${path.basename(bootPath)}" onerror="${failure}"></script>\n  <!-- /app-bundle -->`;
const updated = html.replace(/<!-- app-bundle -->[\s\S]*?<!-- \/app-bundle -->/, script);
await writeFile(htmlPath, updated);
// Three.js shader templates retain trailing spaces when bundled.
for (const name of await readdir(output)) {
  const file = path.join(output, name);
  const source = await readFile(file, 'utf8');
  const normalized = source.replace(/[ \t]+$/gm, '');
  await writeFile(file, normalized);
}
console.log('Built optimized portfolio assets.');
