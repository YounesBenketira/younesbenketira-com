function heightMaterial(source, height, mask = null) {
  const material = source.clone();
  material.emissive.set('#ffd28a');
  material.emissiveIntensity = 3;
  material.emissiveMap = mask;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.patternHeight = height;
    shader.vertexShader = 'varying float patternWorldHeight;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
      #include <project_vertex>
      vec4 patternPosition=vec4(transformed,1.0);
      #ifdef USE_INSTANCING
        patternPosition=instanceMatrix*patternPosition;
      #endif
      patternWorldHeight=(modelMatrix*patternPosition).y;
    `);
    shader.fragmentShader = 'uniform float patternHeight;\nvarying float patternWorldHeight;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      float reached=1.0-smoothstep(patternHeight-4.0,patternHeight+4.0,patternWorldHeight);
      totalEmissiveRadiance*=reached;
    `);
  };
  material.customProgramCacheKey = () => 'minaret-pattern-height-v1';
  return material;
}

export function addPatternMaterials(materials, carvingMask, headerMask) {
  const height = { value: -100 };
  materials.patternGlow = {
    height,
    grille: heightMaterial(materials.screenStone, height),
    carving: heightMaterial(materials.minaretCarving, height, carvingMask),
    header: heightMaterial(materials.minaretHeader, height, headerMask),
  };
  return materials;
}
