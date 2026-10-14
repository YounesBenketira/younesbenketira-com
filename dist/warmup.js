import * as THREE from './vendor/three.module.js';
import { yieldToBrowser } from './loading.js';

function screenPrograms(composer) {
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(2, 2);
  for (const pass of composer.passes) {
    const materials = [pass.material, pass.gtaoMaterial, pass.pdMaterial, pass.copyMaterial, pass.blendMaterial];
    for (const material of materials) {
      if (!material || material.isRawShaderMaterial) continue;
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
    }
  }
  return { group, geometry };
}

async function compileMasks(world) {
  const group = new THREE.Group();
  const kinds = new Set();
  world.scene.traverse(object => {
    if (!object.isMesh) return;
    const kind = Boolean(object.isInstancedMesh);
    if (kinds.has(kind)) return;
    kinds.add(kind);
    for (const material of [world.composer.contextNormal, world.composer.introGlow.materialMask]) {
      const proxy = object.clone(false);
      proxy.material = material;
      group.add(proxy);
    }
  });
  await world.renderer.compileAsync(group, world.camera, world.scene);
}

export async function preparePrograms(world) {
  const { renderer, composer, scene, camera } = world;
  const target = renderer.getRenderTarget();
  const screen = screenPrograms(composer);
  try {
    // Match the live render target so Three.js reuses these shader programs.
    renderer.setRenderTarget(composer.readBuffer);
    await renderer.compileAsync(scene, camera);
    await yieldToBrowser();
    await compileMasks(world);
    const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    await renderer.compileAsync(screen.group, screenCamera);
  } finally {
    renderer.setRenderTarget(target);
    screen.geometry.dispose();
  }
}
