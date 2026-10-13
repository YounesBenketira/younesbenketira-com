import * as THREE from './vendor/three.module.js';

function createBird(material) {
  const bird = new THREE.Group();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0, 2.8, .12, .2, .7, 0, 1.1,
  ], 3));
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(geometry, material);
    wing.scale.x = side;
    bird.add(wing);
  }
  bird.rotation.y = -Math.PI / 2;
  return bird;
}

export function createBirds(scene) {
  const group = new THREE.Group();
  group.name = 'Distant summit birds';
  group.visible = false;
  const material = new THREE.MeshBasicMaterial({
    color: '#405157', side: THREE.DoubleSide, transparent: true, depthWrite: false,
  });
  for (let index = 0; index < 7; index += 1) {
    const bird = createBird(material);
    group.add(bird);
  }
  scene.add(group);
  return { group, material, time: 0, visibility: 0, ray: new THREE.Vector3() };
}

export function updateBirds(world, visibility, elapsed, reducedMotion) {
  const flock = world.birds;
  if (flock.visibility !== visibility) world.needsRender = true;
  flock.visibility = visibility;
  flock.group.visible = visibility > 0;
  if (!flock.group.visible) return;
  flock.material.opacity = visibility * .8;
  if (!reducedMotion && elapsed > 0) {
    flock.time += elapsed;
    world.needsRender = true;
  }
  flock.group.children.forEach((bird, index) => {
    const phase = (flock.time * .018 + index * .17) % 1.25;
    const x = phase * 2 - 1.25;
    const y = .68 + Math.sin(flock.time * .25 + index) * .08 + index % 3 * .07;
    flock.ray.set(x, y, .7).unproject(world.camera).sub(world.camera.position).normalize();
    bird.position.copy(world.camera.position).addScaledVector(flock.ray, 360 + index * 24);
    const flap = Math.sin(flock.time * 4 + index * 1.4) * .55;
    bird.children.forEach((wing, wingIndex) => {
      wing.rotation.z = (wingIndex === 0 ? -1 : 1) * (.2 + flap);
    });
  });
}
