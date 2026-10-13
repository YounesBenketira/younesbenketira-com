import * as THREE from './vendor/three.module.js';

const positionVertex = `
  vec4 surfacePosition = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    surfacePosition = instanceMatrix * surfacePosition;
  #endif
  vStonePosition = (modelMatrix * surfacePosition).xyz;
`;

const sampleFragment = `
  uniform sampler2D limestone;
  uniform float stoneScale;
  varying vec3 vStonePosition;
  vec3 stoneColor() {
    vec3 face = abs(normalize(cross(dFdx(vStonePosition), dFdy(vStonePosition))));
    vec3 weight = pow(face, vec3(4.0));
    weight /= max(dot(weight, vec3(1.0)), .0001);
    vec3 p = vStonePosition * stoneScale;
    return texture2D(limestone, p.yz).rgb * weight.x
      + texture2D(limestone, p.xz).rgb * weight.y
      + texture2D(limestone, p.xy).rgb * weight.z;
  }
`;

const colorFragment = `
  vec3 grain = stoneColor();
  float relief = dot(grain, vec3(.2126, .7152, .0722));
  diffuseColor.rgb *= mix(vec3(1.0), grain, .8);
`;

const pavingFragment = `
  vec2 grid = vStonePosition.xz / 3.0;
  vec2 edge = min(fract(grid), 1.0 - fract(grid));
  vec2 antialias = max(fwidth(grid), vec2(.001));
  vec2 grout = smoothstep(vec2(.004), vec2(.004) + antialias, edge);
  diffuseColor.rgb *= mix(.85, 1.0, min(grout.x, grout.y));
`;

/**
 * World-space sampling keeps grain the same size on walls, columns and instanced blocks.
 */
function textureMaterial(material, texture, scale, paving = false) {
  material.map = null;
  material.bumpMap = texture;
  material.bumpScale = .065;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.limestone = { value: texture };
    shader.uniforms.stoneScale = { value: scale };
    shader.vertexShader = 'varying vec3 vStonePosition;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', positionVertex + '\n#include <worldpos_vertex>');
    shader.fragmentShader = sampleFragment + shader.fragmentShader;
    const color = paving ? colorFragment + pavingFragment : colorFragment;
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', color);
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', 'float roughnessFactor = clamp(roughness + (1.0 - relief) * .25, .04, 1.0);');
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', 'normal = perturbNormalArb(-vViewPosition, normal, vec2(dFdx(relief), dFdy(relief)) * bumpScale, faceDirection);');
  };
  material.customProgramCacheKey = () => `limestone-${paving}`;
  material.needsUpdate = true;
}

export async function applyLimestone(world) {
  try {
    const texture = await new THREE.TextureLoader().loadAsync('./textures/ivory-limestone.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.anisotropy = Math.min(8, world.renderer.capabilities.getMaxAnisotropy());
    const materials = world.materials;
    textureMaterial(materials.stone, texture, .24);
    textureMaterial(materials.ivory, texture, .24);
    textureMaterial(materials.trim, texture, .3);
    textureMaterial(materials.paving, texture, .3, true);
    materials.paving.roughness = .55;
    materials.paving.clearcoat = .12;
    world.needsRender = true;
  } catch (error) {
    console.warn('Limestone texture unavailable; using the procedural stone.', error);
  }
}
