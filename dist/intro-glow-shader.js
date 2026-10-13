import * as THREE from './vendor/three.module.js';

export const glowShader = {
  uniforms: {
    tDiffuse: { value: null }, silhouette: { value: null },
    outlineDepth: { value: null }, sceneDepth: { value: null },
    cameraNear: { value: .4 }, cameraFar: { value: 10000 },
    pixelSize: { value: new THREE.Vector2(1, 1) },
    opacity: { value: 1 }, radii: { value: new THREE.Vector4(2, 6, 13, 22) },
    weights: { value: new THREE.Vector4(.026, .018, .008, .003) },
    glowColor: { value: new THREE.Color('#ffe6aa') },
  },
  vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader: `
    #include <packing>
    uniform sampler2D tDiffuse;
    uniform sampler2D silhouette;
    uniform sampler2D outlineDepth;
    uniform sampler2D sceneDepth;
    uniform float cameraNear;
    uniform float cameraFar;
    uniform vec2 pixelSize;
    uniform vec3 glowColor;
    uniform float opacity;
    uniform vec4 radii;
    uniform vec4 weights;
    varying vec2 vUv;
    float visibleEdge(vec2 uv,float foreground){
      vec2 mask=texture2D(silhouette,uv).rg;
      float depth=texture2D(outlineDepth,uv).r;
      float distance=-perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
      return mask.r*mask.g*step(distance,foreground+.5);
    }
    void main(){
      vec4 color=texture2D(tDiffuse,vUv);
      float center=texture2D(silhouette,vUv).r;
      float depth=texture2D(sceneDepth,vUv).r;
      float foreground=-perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
      float halo=0.0;
      for(int i=0;i<16;i++){
        float angle=float(i)*.392699;
        float cosine=cos(angle);
        float sine=sin(angle);
        vec2 direction=vec2(cosine,sine)*pixelSize;
        halo+=visibleEdge(vUv+direction*radii.x,foreground)*weights.x;
        halo+=visibleEdge(vUv+direction*radii.y,foreground)*weights.y;
        halo+=visibleEdge(vUv+direction*radii.z,foreground)*weights.z;
        halo+=visibleEdge(vUv+direction*radii.w,foreground)*weights.w;
      }
      float glow=halo*(1.0-center)*opacity;
      gl_FragColor=vec4(color.rgb+glowColor*glow,color.a);
    }`,
};

export function createOutlineMask() {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying float worldHeight;
      void main(){
        vec4 point=vec4(position,1.0);
        #ifdef USE_INSTANCING
          point=instanceMatrix*point;
        #endif
        vec4 world=modelMatrix*point;
        worldHeight=world.y;
        gl_Position=projectionMatrix*viewMatrix*world;
      }`,
    fragmentShader: `
      varying float worldHeight;
      void main(){
        float raised=smoothstep(1.5,3.0,worldHeight);
        gl_FragColor=vec4(1.0,raised,0.0,1.0);
      }`,
  });
}
