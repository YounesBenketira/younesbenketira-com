import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import * as THREE from '../dist/vendor/three.module.js';
import { buildSurroundings } from '../dist/surroundings-geometry.js';
import { buildCityData, runtimeCityData } from './build-city-data.mjs';
import { buildCompression } from './build-compression.mjs';

test('runtime map produces identical city geometry and context', async () => {
  const input = new URL('../dist/data/algiers-context.json', import.meta.url);
  const source = await readFile(input, 'utf8');
  const data = JSON.parse(source);
  const runtime = runtimeCityData(data);
  const materials = Object.fromEntries(['walls', 'roofs', 'flat', 'water', 'leaves'].map(name => {
    const material = new THREE.MeshBasicMaterial();
    material.name = name;
    return [name, material];
  }));
  const original = buildSurroundings(data, materials);
  const optimized = buildSurroundings(runtime, materials);
  assert.equal(runtime.meta.osmTimestamp, data.meta.osmTimestamp);
  assert.equal(runtime.buildings.length, data.buildings.length);
  assert.equal(runtime.roads.length, data.roads.length);
  assert.equal(optimized.children.length, original.children.length);
  original.children.forEach((mesh, index) => {
    const actual = optimized.children[index];
    assert.equal(actual.material, mesh.material);
    assert.equal(actual.receiveShadow, mesh.receiveShadow);
    assert.equal(actual.count, mesh.count);
    assert.deepEqual(actual.geometry.index?.array, mesh.geometry.index?.array);
    assert.deepEqual(actual.geometry.boundingSphere, mesh.geometry.boundingSphere);
    assert.deepEqual(actual.instanceMatrix?.array, mesh.instanceMatrix?.array);
    assert.deepEqual(Object.keys(actual.geometry.attributes), Object.keys(mesh.geometry.attributes));
    for (const [name, attribute] of Object.entries(mesh.geometry.attributes)) {
      assert.deepEqual(actual.geometry.attributes[name].array, attribute.array);
    }
    mesh.geometry.dispose();
    actual.geometry.dispose();
  });
  Object.values(materials).forEach(material => material.dispose());
});

test('runtime map URLs follow content and compressed files round trip', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'portfolio-build-'));
  try {
    const dataDirectory = path.join(directory, 'data');
    const output = path.join(directory, 'bundles');
    await mkdir(dataDirectory);
    await mkdir(output);
    const input = new URL('../dist/data/algiers-context.json', import.meta.url);
    const dataPath = path.join(dataDirectory, 'algiers-context.json');
    const source = await readFile(input, 'utf8');
    await writeFile(dataPath, source);
    const first = await buildCityData(directory, output);
    assert.equal(await buildCityData(directory, output), first);
    const changed = JSON.parse(source);
    changed.buildings[0].h += 1;
    await writeFile(dataPath, JSON.stringify(changed));
    assert.notEqual(await buildCityData(directory, output), first);
    await buildCompression(output);
    const files = await readdir(output);
    for (const name of files.filter(file => file.endsWith('.json'))) {
      const file = path.join(output, name);
      const expected = await readFile(file);
      const br = await readFile(`${file}.br`);
      const gz = await readFile(`${file}.gz`);
      assert.deepEqual(brotliDecompressSync(br), expected);
      assert.deepEqual(gunzipSync(gz), expected);
      assert.ok(br.length < gz.length);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
