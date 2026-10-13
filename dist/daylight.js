import * as THREE from './vendor/three.module.js';

export function updateTimeOfDay(world, hour) {
  const angle = (hour - 6) / 12 * Math.PI;
  const elevation = Math.sin(angle);
  const daylight = THREE.MathUtils.smoothstep(elevation, -.1, .4);
  const twilight = (1 - THREE.MathUtils.smoothstep(Math.abs(elevation), 0, .4)) * daylight;
  world.sun.position.set(300 * Math.cos(angle), 237 * elevation, -190);
  world.sun.color.setHSL(.105, .335 + (1 - daylight) * .35, .88);
  world.sun.intensity = 3.2 * daylight;
  world.ambient.intensity = .08 + .27 * daylight;
  world.scene.environmentIntensity = .06 + .66 * daylight;
  world.scene.fog.color.set('#101e36').lerp(new THREE.Color('#dce0df'), daylight);
  world.scene.fog.color.lerp(new THREE.Color('#cf9476'), twilight * .65);
  world.materials.lamp.emissiveIntensity = .25 + (1 - daylight) * 1.75;
  const uniforms = world.sky.material.uniforms;
  uniforms.sunDirection.value.copy(world.sun.position).normalize();
  uniforms.daylight.value = daylight;
  uniforms.twilight.value = twilight;
  world.renderer.shadowMap.needsUpdate = true;
  document.body.dataset.night = String(daylight < .25);
}
