import path from 'node:path';

export function buildPreloads(metafile) {
  const entries = ['dist/boot.js', 'dist/app.js'];
  const links = entries.map(entry => {
    const output = Object.entries(metafile.outputs).find(([, data]) => data.entryPoint === entry);
    if (!output) throw new Error(`Missing preload entry: ${entry}`);
    return `<link rel="modulepreload" href="./bundles/${path.basename(output[0])}">`;
  });
  return `<!-- startup-preloads -->\n  ${links.join('\n  ')}\n  <!-- /startup-preloads -->`;
}
