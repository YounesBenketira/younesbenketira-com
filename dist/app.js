import { preparePrograms } from './warmup.js';
import { updateTimeOfDay } from './daylight.js';
import { progress, yieldToBrowser } from './loading.js';
import * as THREE from './vendor/three.module.js';
import { createWorld, resizeWorld, positionCamera, updateWorld } from './world.js';
import { createSignature, frameSignature, updateSignature } from './signature.js';
import { applyLimestone } from './surfaces.js';
import { createJourney, heroPose } from './journey.js';
import { loadSurroundings, prepareSurroundings } from './surroundings.js';
import { createScrollbar } from './scrollbar.js';

const canvas = document.querySelector('#mosque');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const state = {
  yaw: THREE.MathUtils.degToRad(151.4),
  pitch: THREE.MathUtils.degToRad(-7.3),
  distance: 310,
  focus: new THREE.Vector3(-30.5, 48, -21.9),
  timeOfDay: 9.25,
  pointer: new THREE.Vector2(),
  targetPointer: new THREE.Vector2(),
  cameraEye: new THREE.Vector3(),
  cameraTarget: new THREE.Vector3(),
  cameraFov: 30,
  cameraShift: 0,
  heroVisibility: 1,
  introGlowOpacity: 1,
  glowHeight: -4,
  summitVisibility: 0,
};
let world;
const journey = createJourney();
createScrollbar();

function bindParallax() {
  window.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType !== 'mouse') return;
    state.targetPointer.set(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2);
  });
  const reset = () => state.targetPointer.set(0, 0);
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  reducedMotion.addEventListener('change', () => {
    reset();
    state.pointer.set(0, 0);
  });
}

function animate() {
  let previous = performance.now();
  world.renderer.setAnimationLoop((now) => {
    const elapsed = Math.min((now - previous) / 1000, 1);
    previous = now;
    if (document.hidden) return;
    state.pointer.lerp(state.targetPointer, 1 - Math.exp(-elapsed * 3));
    if (state.pointer.distanceTo(state.targetPointer) < .0001) state.pointer.copy(state.targetPointer);
    journey.update(world, state, reducedMotion.matches);
    updateSignature(world, state.heroVisibility);
    updateWorld(world, state, elapsed, reducedMotion.matches);
  });
}

function showSceneFallback(message) {
  world?.renderer.setAnimationLoop(null);
  document.querySelector('#scene').classList.remove('is-ready');
  const experience = document.querySelector('#experience');
  experience.classList.remove('scene-ready');
  experience.classList.add('scene-failed');
  const contact = document.querySelector('.contact-frame');
  contact.inert = false;
  contact.style.removeProperty('opacity');
  contact.style.removeProperty('visibility');
  document.querySelector('#notice').textContent = message;
  window.dispatchEvent(new Event('scene-failed'));
}

async function start() {
  progress('code');
  const prepared = prepareSurroundings();
  prepared.catch(() => {});
  world = await createWorld(canvas);
  let viewportSize = '';
  const resize = (render = true) => {
    if (document.querySelector('#experience').classList.contains('scene-failed')) return;
    const nextSize = `${canvas.clientWidth}:${canvas.clientHeight}`;
    if (nextSize === viewportSize) return;
    viewportSize = nextSize;
    state.pointer.set(0, 0);
    state.targetPointer.set(0, 0);
    resizeWorld(world, canvas);
    journey.measure();
    const hero = heroPose(state, world.camera.aspect);
    state.cameraEye.copy(hero.eye);
    state.cameraTarget.copy(hero.target);
    state.cameraFov = hero.fov;
    state.cameraShift = 0;
    positionCamera(world, state);
    world.camera.updateMatrixWorld();
    frameSignature(world);
    journey.update(world, state, reducedMotion.matches);
    updateSignature(world, state.heroVisibility);
    if (render) updateWorld(world, state);
  };
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    showSceneFallback('Reload to restore the mosque view.');
  });
  bindParallax();
  const surroundings = loadSurroundings(world, prepared).catch((error) => {
    document.querySelector('#notice').textContent = 'The surrounding city could not load. Reload to try again.';
    progress('city');
    console.warn('Surrounding city initialization failed:', error);
  });
  await Promise.all([createSignature(world), applyLimestone(world), surroundings]);
  progress('assets');
  await yieldToBrowser();
  if (document.querySelector('#experience').classList.contains('scene-failed')) return;
  resize(false);
  updateTimeOfDay(world, state.timeOfDay);
  await preparePrograms(world);
  progress('frame', .5);
  await yieldToBrowser();
  updateWorld(world, state);
  new ResizeObserver(() => resize()).observe(canvas);
  document.querySelector('#experience').classList.add('scene-ready');
  document.querySelector('#scene').classList.add('is-ready');
  performance.mark('scene-ready');
  progress('frame');
  await new Promise(requestAnimationFrame);
  window.dispatchEvent(new Event('scene-complete'));
  animate();
}

start().catch((error) => {
  showSceneFallback('The mosque view needs WebGL 2. Try enabling hardware acceleration.');
  console.error('Mosque scene initialization failed:', error);
});
