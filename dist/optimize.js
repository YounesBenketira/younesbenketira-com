import * as THREE from './vendor/three.module.js';

/**
 * Repeated static shapes share a draw call while retaining their world transforms.
 */
export function instanceStaticMeshes(scene) {
  scene.updateMatrixWorld(true);
  const groups = new Map();
  scene.traverse((mesh) => {
    if (!mesh.isMesh || mesh.isInstancedMesh) return;
    if (Array.isArray(mesh.material)) return;
    const key = [mesh.geometry.uuid, mesh.material.uuid, mesh.castShadow, mesh.receiveShadow, mesh.layers.mask].join(':');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(mesh);
  });
  for (const meshes of groups.values()) {
    if (meshes.length < 3) continue;
    const source = meshes[0];
    const instances = new THREE.InstancedMesh(source.geometry, source.material, meshes.length);
    instances.castShadow = source.castShadow;
    instances.receiveShadow = source.receiveShadow;
    instances.layers.mask = source.layers.mask;
    meshes.forEach((mesh, index) => {
      instances.setMatrixAt(index, mesh.matrixWorld);
      mesh.removeFromParent();
    });
    instances.computeBoundingSphere();
    scene.add(instances);
  }
}
