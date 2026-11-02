import path from 'node:path';

export function buildPreloads(metafile) {
  const entries = ['dist/boot.js', 'dist/app.js'];
  const paths = new Set();
  for (const entry of entries) {
    const output = Object.entries(metafile.outputs).find(([, data]) => data.entryPoint === entry);
    if (!output) throw new Error(`Missing preload entry: ${entry}`);
    addStaticImports(output[0], metafile.outputs, paths);
  }
  const links = [...paths].map(file => `<link rel="modulepreload" href="./bundles/${path.basename(file)}">`);
  return `<!-- startup-preloads -->\n  ${links.join('\n  ')}\n  <!-- /startup-preloads -->`;
}

function addStaticImports(file, outputs, paths) {
  if (paths.has(file)) return;
  const output = outputs[file];
  if (!output) throw new Error(`Missing preload output: ${file}`);
  paths.add(file);
  for (const dependency of output.imports) {
    const isStatic = dependency.kind === 'import-statement';
    if (isStatic && !dependency.external) addStaticImports(dependency.path, outputs, paths);
  }
}
