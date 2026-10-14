import * as THREE from './vendor/three.module.js';
import { buildSurroundings } from './surroundings-geometry.js';

function serializeMesh(mesh, buffers) {
  const attributes = {};
  for (const [name, attribute] of Object.entries(mesh.geometry.attributes)) {
    attributes[name] = { array: attribute.array, itemSize: attribute.itemSize };
    buffers.add(attribute.array.buffer);
  }
  const index = mesh.geometry.index?.array;
  if (index) buffers.add(index.buffer);
  const matrices = mesh.instanceMatrix?.array;
  if (matrices) buffers.add(matrices.buffer);
  const sphere = mesh.geometry.boundingSphere;
  return {
    attributes, index, matrices, count: mesh.count, material: mesh.material.name,
    receiveShadow: mesh.receiveShadow,
    sphere: sphere ? { center: sphere.center.toArray(), radius: sphere.radius } : null,
  };
}

self.onmessage = async event => {
  try {
    const response = await fetch(event.data.url);
    if (!response.ok) throw new Error(`Surroundings data returned ${response.status}`);
    const data = await response.json();
    self.postMessage({ progress: .25 });
    const materials = Object.fromEntries(['walls', 'roofs', 'flat', 'water', 'leaves'].map(name => {
      const material = new THREE.MeshBasicMaterial();
      material.name = name;
      return [name, material];
    }));
    const group = buildSurroundings(data, materials);
    const buffers = new Set();
    const meshes = group.children.map(mesh => serializeMesh(mesh, buffers));
    self.postMessage({ meshes, context: {
      buildings: data.buildings.length, roads: data.roads.length, timestamp: data.meta.osmTimestamp,
    } }, [...buffers]);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
