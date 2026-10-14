import { openingVisibility, cityNormals } from './context-materials.js';
import { updateCity } from './surroundings.js';
import { progress, yieldToBrowser } from './loading.js';
import * as THREE from './vendor/three.module.js';
import { EffectComposer } from './vendor/addons/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/addons/postprocessing/RenderPass.js';
import { GTAOPass } from './vendor/addons/postprocessing/GTAOPass.js';
import { OutputPass } from './vendor/addons/postprocessing/OutputPass.js';
import { createMaterials } from './materials.js';
import { createArchitecture } from './architecture.js';
import { createLandscape } from './landscape.js';
import { createEnvironment } from './environment.js';
import { addDetails } from './details.js';
import { instanceStaticMeshes } from './optimize.js';
import { createAtmospherePass } from './effects.js';
import { updateTimeOfDay } from './daylight.js';
import { IntroGlowPass } from './intro-glow.js';
import { updateJourneyGlow } from './journey-glow.js';
import { createBirds, updateBirds } from './birds.js';

function lights(scene) {
  const ambient = new THREE.HemisphereLight('#fff8ed', '#b8aa94', .35);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight('#fff0d7', 3.2);
  sun.position.set(-110, 230, 140);
  sun.castShadow = true;
  const shadowSize = innerWidth < 740 ? 2048 : 4096;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(sun.shadow.camera, { left: -185, right: 185, top: 200, bottom: -185, near: 1, far: 800 });
  sun.shadow.normalBias = .18;
  sun.shadow.bias = -.00004;
  sun.shadow.radius = 3;
  scene.add(sun);
  return { sun, ambient };
}

function createPostProcessing(renderer, scene, camera) {
  const target = new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType });
  const composer = new EffectComposer(renderer, target);
  const render = new RenderPass(scene, camera);
  const occlusion = new GTAOPass(scene, camera, 1, 1);
  occlusion.updateGtaoMaterial({ radius: 5, thickness: 2, distanceExponent: 1.5, scale: 1, samples: 8 });
  occlusion.updatePdMaterial({ radius: 4, samples: 8 });
  occlusion.blendIntensity = .75;
  const output = new OutputPass();
  composer.addPass(render);
  composer.addPass(occlusion);
  composer.contextNormal = occlusion.normalMaterial;
  composer.addPass(createAtmospherePass());
  composer.summitGlow = new IntroGlowPass(scene, camera, occlusion.depthTexture, 2);
  composer.summitGlow.uniforms.glowColor.value.set('#ffc04d');
  composer.addPass(composer.summitGlow);
  composer.introGlow = new IntroGlowPass(scene, camera, occlusion.depthTexture);
  composer.addPass(composer.introGlow);
  composer.addPass(output);
  return composer;
}

export async function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .8;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#dce0df', 900, 4800);
  const camera = new THREE.PerspectiveCamera(38, 1, .4, 10000);
  await yieldToBrowser();
  const materials = createMaterials();
  progress('scene', .2);
  await yieldToBrowser();
  const mosque = createArchitecture(materials);
  mosque.traverse((object) => {
    if (object.isMesh) object.layers.enable(1);
  });
  progress('scene', .5);
  await yieldToBrowser();
  const landscape = createLandscape(materials);
  scene.add(mosque, landscape);
  addDetails(scene, materials);
  progress('scene', .7);
  await yieldToBrowser();
  const sky = createEnvironment(scene, renderer);
  const { sun, ambient } = lights(scene);
  instanceStaticMeshes(scene);
  const birds = createBirds(scene);
  const composer = createPostProcessing(renderer, scene, camera);
  progress('scene');
  await yieldToBrowser();
  const contextRadius = { value: 300 };
  const cityReveal = { value: 0 };
  openingVisibility(composer.contextNormal, contextRadius);
  cityNormals(composer.contextNormal, cityReveal);
  const lastCamera = new THREE.Matrix4();
  return { renderer, composer, scene, camera, sun, ambient, sky, materials, birds, lastCamera, contextRadius, cityReveal, needsRender: true, lastHour: -1 };
}

export function resizeWorld(world, canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  world.needsRender = true;
  world.renderer.setSize(width, height, false);
  world.composer.setSize(width, height);
  world.camera.aspect = width / height;
  world.camera.clearViewOffset();
  world.lastShift = NaN;
  world.camera.updateProjectionMatrix();
}

export function positionCamera(world, state) {
  const camera = world.camera;
  if (camera.fov !== state.cameraFov) {
    camera.fov = state.cameraFov;
    camera.updateProjectionMatrix();
    world.needsRender = true;
  }
  if (world.lastShift !== state.cameraShift) {
    const width = world.renderer.domElement.clientWidth;
    const height = world.renderer.domElement.clientHeight;
    const offset = width * state.cameraShift;
    camera.setViewOffset(width, height, offset, 0, width, height);
    world.lastShift = state.cameraShift;
    world.needsRender = true;
  }
  const target = state.cameraTarget.clone();
  const right = new THREE.Vector3().subVectors(state.cameraEye, target);
  right.cross(camera.up).normalize();
  const horizontal = state.pointer.x * 2.4 * state.heroVisibility;
  const vertical = state.pointer.y * 1.3 * state.heroVisibility;
  const shift = right.multiplyScalar(horizontal);
  shift.y -= vertical;
  camera.position.copy(state.cameraEye).add(shift);
  target.add(shift);
  camera.lookAt(target);
}

export function updateWorld(world, state, elapsed = 0, reducedMotion = false) {
  positionCamera(world, state);
  updateJourneyGlow(world, state);
  updateCity(world, elapsed, reducedMotion);
  if (world.contextRadius) {
    const portraitDistance = state.distance * 1.05 / world.camera.aspect;
    const openingRadius = Math.max(300, portraitDistance);
    world.contextRadius.value = 15 + state.heroVisibility * (openingRadius - 15);
  }
  world.camera.updateMatrixWorld();
  updateBirds(world, state.summitVisibility, elapsed, reducedMotion);
  const cameraChanged = !world.lastCamera.equals(world.camera.matrixWorld);
  const lightChanged = world.lastHour !== state.timeOfDay;
  const requested = world.needsRender;
  const changed = cameraChanged || lightChanged;
  if (!changed && !requested) return;
  if (lightChanged) {
    updateTimeOfDay(world, state.timeOfDay);
    world.lastHour = state.timeOfDay;
  }
  world.lastCamera.copy(world.camera.matrixWorld);
  world.needsRender = false;
  world.composer.render();
}
