import * as THREE from './vendor/three.module.js';

function lightMaterial(world, material, intensity) {
  if (material.emissiveIntensity === intensity) return;
  material.emissiveIntensity = intensity;
  world.needsRender = true;
}

function updateHalo(world, pass, opacity) {
  const visible = opacity > 0;
  if (pass.enabled === visible && pass.uniforms.opacity.value === opacity) return;
  pass.enabled = visible;
  pass.uniforms.opacity.value = opacity;
  world.needsRender = true;
}

export function updateJourneyGlow(world, state) {
  updateHalo(world, world.composer.introGlow, state.introGlowOpacity);
  world.materials.minaretWindows.forEach((material, level) => {
    const height = 28.65 + level * 28.7;
    const amount = THREE.MathUtils.smoothstep(state.glowHeight, height - 12, height + 4);
    lightMaterial(world, material, amount * 3.5);
  });
  const crown = THREE.MathUtils.smoothstep(state.glowHeight, 135, 148.65);
  lightMaterial(world, world.materials.crownGlass, crown * 2.2);
  lightMaterial(world, world.materials.dome, crown * 2.0);
  const patternHeight = state.glowHeight;
  if (world.materials.patternGlow.height.value !== patternHeight) {
    world.materials.patternGlow.height.value = patternHeight;
    world.needsRender = true;
  }
  updateHalo(world, world.composer.summitGlow, crown);
}
