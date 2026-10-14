import * as THREE from './vendor/three.module.js';
import { contextMaterials } from './context-materials.js';
import { yieldToBrowser } from './loading.js';

function prepareSurroundings() {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(CITY_WORKER_URL, document.baseURI), { type: 'module' });
    const timeout = setTimeout(() => finish(new Error('City loading timed out')), 90000);
    function finish(error, result) {
      clearTimeout(timeout);
      worker.terminate();
      if (error) reject(error);
      else resolve(result);
    }
    worker.onerror = () => finish(new Error('City worker failed'));
    worker.onmessage = ({ data }) => {
      if (data.error) finish(new Error(data.error));
      else if (data.meshes) finish(null, data);
    };
    const url = new URL('./data/algiers-context.json', document.baseURI).href;
    worker.postMessage({ url });
  });
}

function restoreMesh(data, materials) {
  const geometry = new THREE.BufferGeometry();
  for (const [name, attribute] of Object.entries(data.attributes)) {
    const buffer = new THREE.BufferAttribute(attribute.array, attribute.itemSize);
    geometry.setAttribute(name, buffer);
  }
  if (data.index) {
    const index = new THREE.BufferAttribute(data.index, 1);
    geometry.setIndex(index);
  }
  if (data.sphere) {
    const center = new THREE.Vector3().fromArray(data.sphere.center);
    geometry.boundingSphere = new THREE.Sphere(center, data.sphere.radius);
  }
  const flags = new Float32Array(geometry.attributes.position.count).fill(1);
  const mask = new THREE.BufferAttribute(flags, 1);
  geometry.setAttribute('cityMask', mask);
  const material = materials[data.material];
  const mesh = data.matrices
    ? new THREE.InstancedMesh(geometry, material, data.count)
    : new THREE.Mesh(geometry, material);
  if (data.matrices) {
    mesh.instanceMatrix.array.set(data.matrices);
    mesh.computeBoundingSphere();
  }
  mesh.receiveShadow = data.receiveShadow;
  return mesh;
}

function compileCity(world, group) {
  const target = world.renderer.getRenderTarget();
  try {
    world.renderer.setRenderTarget(world.composer.readBuffer);
    return world.renderer.compileAsync(group, world.camera, world.scene);
  } finally {
    // The visible scene keeps rendering while background programs compile.
    world.renderer.setRenderTarget(target);
  }
}

export async function loadSurroundings(world) {
  const data = await prepareSurroundings();
  const materials = contextMaterials(world.contextRadius);
  const group = new THREE.Group();
  group.name = 'Mapped Algiers surroundings';
  for (let index = 0; index < data.meshes.length; index++) {
    const mesh = restoreMesh(data.meshes[index], materials);
    group.add(mesh);
    if (index % 20 === 0) await yieldToBrowser();
  }
  const surfaces = [materials.walls, materials.roofs, materials.flat, materials.water, materials.leaves];
  await compileCity(world, group);
  for (const material of surfaces) {
    material.transparent = true;
    material.opacity = 0;
  }
  await compileCity(world, group);
  if (world.renderer.getContext().isContextLost()) return;
  world.scene.add(group);
  world.cityFade = { surfaces, elapsed: 0 };
  performance.mark('city-ready');
  world.context = data.context;
  world.renderer.shadowMap.needsUpdate = true;
  world.needsRender = true;
}

export function updateCity(world, elapsed, reducedMotion) {
  if (!world.cityFade) return;
  const fade = world.cityFade;
  fade.elapsed += elapsed;
  const fraction = reducedMotion ? 1 : Math.min(1, fade.elapsed / .8);
  const opacity = fraction * fraction * (3 - 2 * fraction);
  for (const material of fade.surfaces) {
    material.opacity = opacity;
    if (fraction === 1) material.transparent = false;
  }
  world.cityReveal.value = opacity;
  world.needsRender = true;
  if (fraction === 1) {
    world.cityFade = null;
    performance.mark('city-visible');
  }
}
