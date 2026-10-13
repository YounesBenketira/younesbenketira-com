import * as THREE from './vendor/three.module.js';

function facadeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  context.fillStyle = '#eeebe3';
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = '#ded9cf';
  context.fillRect(0, 119, 128, 9);
  context.fillStyle = '#c5c5bc';
  context.fillRect(31, 22, 61, 80);
  context.fillStyle = '#46636b';
  context.fillRect(35, 25, 52, 67);
  context.fillStyle = '#799297';
  context.fillRect(38, 28, 21, 59);
  context.fillStyle = '#e4dfd2';
  context.fillRect(60, 25, 3, 68);
  context.fillRect(30, 93, 65, 5);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

export function openingVisibility(material, radius) {
  material.defaultAttributeValues = { ...material.defaultAttributeValues, contextMask: [0] };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.contextClearRadius = radius;
    shader.vertexShader = 'attribute float contextMask; varying float contextFade; varying vec3 contextPosition;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
      #include <project_vertex>
      contextFade = contextMask;
      vec4 contextVertex = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        contextVertex = instanceMatrix * contextVertex;
      #endif
      contextPosition = (modelMatrix * contextVertex).xyz;
    `);
    shader.fragmentShader = 'uniform float contextClearRadius; varying float contextFade; varying vec3 contextPosition;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>', `
      #include <clipping_planes_fragment>
      float distanceFromCamera = distance(contextPosition.xz, cameraPosition.xz);
      float visibility = smoothstep(contextClearRadius, contextClearRadius + 50.0, distanceFromCamera);
      float threshold = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
      if (contextFade > 0.5 && visibility <= threshold) discard;
    `);
  };
  material.customProgramCacheKey = () => 'context-opening-visibility';
  material.needsUpdate = true;
  return material;
}

export function contextMaterials() {
  const facade = facadeTexture();
  const radius = { value: 300 };
  const walls = new THREE.MeshStandardMaterial({ map: facade, vertexColors: true, roughness: .92, side: THREE.DoubleSide });
  const roofs = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .96, side: THREE.DoubleSide });
  const leaves = new THREE.MeshStandardMaterial({ color: '#758657', roughness: 1 });
  return {
    radius,
    walls: openingVisibility(walls, radius),
    roofs: openingVisibility(roofs, radius),
    leaves: openingVisibility(leaves, radius),
    flat: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .96, side: THREE.DoubleSide }),
    water: new THREE.MeshStandardMaterial({ color: '#347d93', roughness: .34, metalness: .22, side: THREE.DoubleSide }),
  };
}
