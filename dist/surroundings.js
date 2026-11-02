import * as THREE from './vendor/three.module.js';
import { contextMaterials } from './context-materials.js';
import { progress, yieldToBrowser } from './loading.js';

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

export async function loadSurroundings(world, prepared) {
  const data = await prepared;
  const materials = contextMaterials(world.contextRadius);
  const group = new THREE.Group();
  group.name = 'Mapped Algiers surroundings';
  for (let index = 0; index < data.meshes.length; index++) {
    const mesh = restoreMesh(data.meshes[index], materials);
    group.add(mesh);
    if (index % 20 === 0) await yieldToBrowser();
  }
  world.scene.add(group);
  performance.mark('city-ready');
  world.context = data.context;
  world.renderer.shadowMap.needsUpdate = true;
  world.needsRender = true;
  progress('city');
}
