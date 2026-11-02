import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function runtimeCityData(data) {
  return {
    meta: { osmTimestamp: data.meta.osmTimestamp },
    buildings: data.buildings.map(({ id, p, holes, h }) => ({ id, p, holes, h })),
    roads: data.roads.map(({ p, w, kind, bridge }) => ({ p, w, kind, bridge })),
    surfaces: data.surfaces.map(({ p, kind }) => ({ p, kind })),
    rivers: data.rivers.map(({ p, w }) => ({ p, w })),
    sea: { p: data.sea.p },
    site: data.site,
    terrain: data.terrain,
  };
}

export async function buildCityData(root, output) {
  const sourcePath = path.join(root, 'data/algiers-context.json');
  const source = await readFile(sourcePath, 'utf8');
  const data = JSON.parse(source);
  const runtime = runtimeCityData(data);
  const content = JSON.stringify(runtime);
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 16);
  const name = `algiers-context-${hash}.json`;
  const target = path.join(output, name);
  await writeFile(target, content);
  return `./bundles/${name}`;
}
