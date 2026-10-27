import * as THREE from './vendor/three.module.js';
import { minaretPosition } from './architecture.js';

const towerHeights = [32, 96, 148.65];

export function heroPose(state, aspect) {
  const portrait = 1 - THREE.MathUtils.smoothstep(aspect, .7, 1.05);
  const distance = state.distance * Math.max(1, THREE.MathUtils.lerp(1.05, .72, portrait) / aspect);
  const yaw = THREE.MathUtils.lerp(state.yaw, THREE.MathUtils.degToRad(178), portrait);
  const focus = state.focus.clone();
  focus.x += portrait * 17.5;
  focus.y += portrait * 20;
  const radius = distance * Math.cos(state.pitch);
  const x = focus.x + Math.sin(yaw) * radius;
  const clearance = 2.4 + portrait * 32;
  const y = Math.max(clearance, focus.y + Math.sin(state.pitch) * distance);
  const z = focus.z + Math.cos(yaw) * radius;
  const eye = new THREE.Vector3(x, y, z);
  return { eye, target: focus, fov: THREE.MathUtils.lerp(34, 30, portrait) };
}

function chapterPose(index, aspect) {
  const direction = new THREE.Vector3(48, 0, -330).normalize();
  const eye = new THREE.Vector3(minaretPosition.x + 10, towerHeights[index], minaretPosition.z + 82);
  const target = eye.clone().addScaledVector(direction, 130);
  const fov = 48;
  const center = towerProjection(eye, direction, fov, aspect);
  const shift = center + .28;
  return { eye, target, fov, shift };
}

function towerProjection(eye, direction, fov, aspect) {
  const anchor = new THREE.Vector3(minaretPosition.x, eye.y, minaretPosition.z).sub(eye);
  const right = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
  const depth = anchor.dot(direction);
  return anchor.dot(right) / (2 * depth * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * aspect);
}

function approachBase(start, end, amount, state) {
  const lift = THREE.MathUtils.smoothstep(amount, 0, .2);
  const travel = THREE.MathUtils.smoothstep(amount, .16, .84);
  const descent = THREE.MathUtils.smoothstep(amount, .82, 1);
  const center = new THREE.Vector3(-5, 0, -10);
  const origin = start.eye.clone().sub(center);
  const destination = end.eye.clone().sub(center);
  const startAngle = Math.atan2(origin.x, origin.z);
  const endAngle = Math.atan2(destination.x, destination.z);
  const angle = THREE.MathUtils.lerp(startAngle, endAngle, travel);
  const startRadius = Math.hypot(origin.x, origin.z);
  const endRadius = Math.hypot(destination.x, destination.z);
  const outward = 90 * Math.sin(Math.PI * travel) ** 2;
  const radius = THREE.MathUtils.lerp(startRadius, endRadius, travel) + outward;
  const raised = THREE.MathUtils.lerp(start.eye.y, start.eye.y + 65, lift);
  const x = center.x + Math.sin(angle) * radius;
  const y = THREE.MathUtils.lerp(raised, end.eye.y, descent);
  const z = center.z + Math.cos(angle) * radius;
  state.cameraEye.set(x, y, z);
  aimApproach(start, end, amount, state);
}

function aimApproach(start, end, amount, state) {
  const direction = start.target.clone().sub(start.eye).normalize();
  const mosqueDirection = new THREE.Vector3(-10, 12, -15).sub(state.cameraEye).normalize();
  const endDirection = end.target.clone().sub(end.eye).normalize();
  const lift = THREE.MathUtils.smoothstep(amount, 0, .2);
  const settle = THREE.MathUtils.smoothstep(amount, .82, 1);
  const overview = lift * (1 - settle);
  direction.lerp(mosqueDirection, lift).normalize();
  direction.lerp(endDirection, settle).normalize();
  state.cameraTarget.copy(state.cameraEye).addScaledVector(direction, 130);
  state.cameraFov = THREE.MathUtils.lerp(start.fov, end.fov, amount) + overview * 10;
}

export function createJourney() {
  const sections = [...document.querySelectorAll('#story > [data-chapter]')];
  const markers = [...document.querySelectorAll('[data-stop]')];
  let positions = [];
  let active = -1;
  let contentWash = -1;
  const scrollCue = document.querySelector('.scroll-cue');
  const contact = document.querySelector('.contact-frame');
  let contactVisibility = -1;
  let cueVisibility = -1;
  const measure = () => { positions = sections.map((section) => section.offsetTop); };
  measure();
  new ResizeObserver(measure).observe(document.querySelector('#story'));

  function updateIntro(scroll, state) {
    const visibility = 1 - THREE.MathUtils.smoothstep(scroll, 0, innerHeight * .2);
    state.introGlowOpacity = visibility;
    if (cueVisibility === visibility) return;
    cueVisibility = visibility;
    scrollCue.style.opacity = String(visibility);
    scrollCue.style.visibility = visibility > 0 ? 'visible' : 'hidden';
  }

  function updateContact(scroll) {
    const end = positions[3];
    const opacity = THREE.MathUtils.smoothstep(scroll, end - innerHeight * .25, end);
    if (opacity === contactVisibility) return;
    contactVisibility = opacity;
    contact.style.opacity = String(opacity);
    contact.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    contact.inert = opacity === 0;
  }

  function holdLength(index) {
    if (index === 0) return 0;
    return Math.min(innerHeight * .38, (positions[index + 1] - positions[index]) * .3);
  }

  function locate(scroll) {
    let index = 0;
    while (index < positions.length - 2 && scroll >= positions[index + 1]) index += 1;
    const start = positions[index];
    const end = positions[index + 1];
    const hold = holdLength(index);
    const blend = THREE.MathUtils.smoothstep(scroll, start + hold, end);
    return { index, blend };
  }

  return {
    measure,
    update(world, state, reducedMotion) {
      const scroll = Math.max(0, window.scrollY);
      const wash = THREE.MathUtils.smoothstep(scroll, positions[1] - innerHeight * .2, positions[1]);
      if (wash !== contentWash) {
        contentWash = wash;
        document.documentElement.style.setProperty('--content-wash', String(wash));
      }
      const { index, blend } = locate(scroll);
      const aspect = world.camera.aspect;
      const start = index === 0 ? heroPose(state, aspect) : chapterPose(index - 1, aspect);
      const end = chapterPose(index, aspect);
      const amount = reducedMotion ? Number(blend > .5) : blend;
      state.cameraEye.copy(start.eye).lerp(end.eye, amount);
      state.cameraTarget.copy(start.target).lerp(end.target, amount);
      state.cameraFov = THREE.MathUtils.lerp(start.fov, end.fov, amount);
      if (index === 0) approachBase(start, end, amount, state);
      const framing = THREE.MathUtils.smoothstep(amount, .28, 1);
      state.cameraShift = index === 0 ? end.shift * framing : end.shift;
      state.heroVisibility = index === 0 ? 1 - THREE.MathUtils.smoothstep(amount, .08, .65) : 0;
      updateIntro(scroll, state);
      updateContact(scroll);
      const baseReveal = THREE.MathUtils.smoothstep(scroll, positions[1], positions[1] + holdLength(1));
      state.glowHeight = index > 0 ? THREE.MathUtils.lerp(-4, state.cameraEye.y, baseReveal) : -4;
      state.summitVisibility = index === 2 ? THREE.MathUtils.smoothstep(amount, .9, 1) : 0;
      const nextIndex = index + Number(blend > .5);
      const nextActive = Math.min(3, nextIndex);
      if (nextActive === active) return;
      active = nextActive;
      markers.forEach((marker, markerIndex) => {
        if (markerIndex === active) marker.setAttribute('aria-current', 'step');
        else marker.removeAttribute('aria-current');
      });
      document.body.dataset.chapter = String(active);
    },
  };
}
