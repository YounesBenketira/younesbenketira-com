import * as THREE from './vendor/three.module.js';
import { minaretPosition } from './architecture.js';

function signatureTexture(portrait = false) {
  const surface = document.createElement('canvas');
  surface.width = portrait ? 1024 : 2048;
  surface.height = portrait ? 768 : 384;
  const context = surface.getContext('2d');
  context.font = `${portrait ? 280 : 240}px "Great Vibes", cursive`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = portrait ? '#ffffff' : '#fff4dc';
  context.shadowColor = '#241e16d9';
  context.shadowBlur = 18;
  context.shadowOffsetY = 2;
  if (portrait) {
    context.strokeStyle = '#30271e99';
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.strokeText('Younes', 512, 230, 920);
    context.strokeText('Benketira', 512, 520, 920);
    context.fillText('Younes', 512, 230, 920);
    context.fillText('Benketira', 512, 520, 920);
  } else {
    context.fillText('Younes Benketira', 1024, 210, 1920);
  }
  const role = document.querySelector('.hero-role').textContent.replace(/\s+/g, ' ').trim();
  context.font = `500 ${portrait ? 36 : 26}px Arial, Helvetica, sans-serif`;
  context.fillText(role.toUpperCase(), surface.width / 2, portrait ? 640 : 330, surface.width * .9);
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export async function createSignature(world) {
  await document.fonts.load('240px "Great Vibes"');
  world.signatureTextures = { landscape: signatureTexture(), portrait: signatureTexture(true) };
  const material = new THREE.MeshBasicMaterial({
    map: world.signatureTextures.landscape, transparent: true, alphaTest: .015,
    depthTest: true, depthWrite: false, toneMapped: false, fog: false,
  });
  const geometry = new THREE.PlaneGeometry(1, 1);
  const signature = new THREE.Mesh(geometry, material);
  signature.name = 'Younes Benketira';
  world.scene.add(signature);
  world.signature = signature;
  const behindMaterial = material.clone();
  behindMaterial.color.set('#785a2c');
  behindMaterial.depthFunc = THREE.GreaterDepth;
  behindMaterial.opacity = 1;
  const occluded = new THREE.Mesh(geometry, behindMaterial);
  occluded.name = 'Signature visible through the minaret';
  occluded.renderOrder = 10;
  world.scene.add(occluded);
  world.signatureOccluded = occluded;
}

export function frameSignature(world) {
  if (!world.signature) return;
  const camera = world.camera;
  const minaret = new THREE.Vector3(minaretPosition.x, 100, minaretPosition.z);
  const towerDistance = camera.position.distanceTo(minaret);
  const depth = Math.max(850, towerDistance + 150);
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * depth;
  const portrait = world.renderer.domElement.clientWidth <= 760 && camera.aspect < 1;
  const texture = world.signatureTextures[portrait ? 'portrait' : 'landscape'];
  world.signature.material.map = texture;
  world.signatureOccluded.material.map = texture;
  world.signatureOccluded.material.color.set(portrait ? '#ffffff' : '#785a2c');
  const span = portrait ? 1.02 : (camera.aspect < 1 ? 1.12 : .84);
  const width = height * camera.aspect * span;
  const offset = new THREE.Vector3(0, height * .19, -depth);
  offset.applyQuaternion(camera.quaternion);
  world.signature.position.copy(camera.position).add(offset);
  world.signature.quaternion.copy(camera.quaternion);
  world.signature.scale.set(width, width * texture.image.height / texture.image.width, 1);
  world.signatureOccluded.position.copy(world.signature.position);
  world.signatureOccluded.quaternion.copy(world.signature.quaternion);
  world.signatureOccluded.scale.copy(world.signature.scale);
  world.needsRender = true;
}

export function updateSignature(world, opacity) {
  if (!world.signature || world.signature.material.opacity === opacity) return;
  world.signature.material.opacity = opacity;
  world.signatureOccluded.material.opacity = opacity;
  world.signature.visible = opacity > .001;
  world.signatureOccluded.visible = opacity > .001;
  world.needsRender = true;
}
