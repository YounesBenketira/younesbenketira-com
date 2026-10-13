import * as THREE from './vendor/three.module.js';
import { ShaderPass } from './vendor/addons/postprocessing/ShaderPass.js';

export function createAtmospherePass() {
  const shader = {
    uniforms: { tDiffuse: { value: null }, pixelSize: { value: new THREE.Vector2(1 / 1440, 1 / 900) } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 pixelSize;
      varying vec2 vUv;
      void main(){
        vec3 color=texture2D(tDiffuse,vUv).rgb;
        vec3 glow=vec3(0.0);
        for(int x=-2;x<=2;x++){
          for(int y=-2;y<=2;y++){
            vec2 offset=vec2(float(x),float(y))*pixelSize*3.0;
            vec3 sampleColor=texture2D(tDiffuse,vUv+offset).rgb;
            float bright=max(max(sampleColor.r,sampleColor.g),sampleColor.b);
            glow+=sampleColor*smoothstep(1.7,4.0,bright)*.04;
          }
        }
        float luminance=dot(color,vec3(.2126,.7152,.0722));
        color=mix(vec3(luminance),color,1.12);
        gl_FragColor=vec4(max(color,vec3(0.0))+glow*.16,1.0);
      }`,
  };
  const pass = new ShaderPass(shader);
  pass.setSize = (width, height) => pass.uniforms.pixelSize.value.set(1 / width, 1 / height);
  return pass;
}