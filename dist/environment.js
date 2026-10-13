import * as THREE from './vendor/three.module.js';

function skyMaterial(environmentSaturation = 1) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      sunDirection: { value: new THREE.Vector3(-.5, .75, .4).normalize() },
      daylight: { value: 1 },
      twilight: { value: 0 },
      environmentSaturation: { value: environmentSaturation },
    },
    vertexShader: 'varying vec3 vDirection; void main(){vDirection=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `
      varying vec3 vDirection;
      uniform vec3 sunDirection;
      uniform float daylight;
      uniform float twilight;
      uniform float environmentSaturation;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.0),f.x),f.y);}
      void main(){
        vec3 direction=normalize(vDirection);
        float elevation=max(direction.y,0.0);
        vec3 nightHorizon=vec3(.012,.025,.055);
        vec3 dayHorizon=vec3(.12,.43,1.0);
        vec3 horizon=mix(nightHorizon,dayHorizon,daylight);
        horizon=mix(horizon,vec3(.8,.35,.16),twilight*.65);
        vec3 nightZenith=vec3(.002,.005,.018);
        vec3 dayZenith=vec3(.012,.22,.85);
        vec3 zenith=mix(nightZenith,dayZenith,daylight);
        float skyBlend=pow(elevation,.42);
        vec3 color=mix(horizon,zenith,skyBlend);
        vec2 uv=direction.xz/(elevation+.18)*2.0;
        float clouds=noise(uv)*.55+noise(uv*2.03)*.28+noise(uv*4.07)*.14;
        float veil=smoothstep(.52,.7,clouds)*smoothstep(.01,.2,elevation)*.8;
        vec3 nightCloud=vec3(.018,.028,.05);
        vec3 dayCloud=vec3(1.4,1.4,1.4);
        vec3 cloudColor=mix(nightCloud,dayCloud,daylight);
        cloudColor=mix(cloudColor,vec3(.9,.5,.3),twilight*.45);
        color=mix(color,cloudColor,veil);
        float sun=max(dot(direction,sunDirection),0.0);
        color+=vec3(1.0,.83,.58)*(pow(sun,1200.0)*9.0+pow(sun,20.0)*.14)*daylight;
        float luminance=dot(color,vec3(.2126,.7152,.0722));
        vec3 neutralLight=vec3(1.0,.98,.95)*luminance;
        gl_FragColor=vec4(mix(neutralLight,color,environmentSaturation),1.0);
      }`,
  });
}

export function createEnvironment(scene, renderer) {
  const skyGeometry = new THREE.SphereGeometry(5500, 32, 16);
  const sky = new THREE.Mesh(skyGeometry, skyMaterial());
  const environmentScene = new THREE.Scene();
  const lightingSky = new THREE.Mesh(skyGeometry, skyMaterial(0));
  environmentScene.add(lightingSky);
  const generator = new THREE.PMREMGenerator(renderer);
  const environmentMap = generator.fromScene(environmentScene, .08, .1, 6000);
  scene.environment = environmentMap.texture;
  scene.environmentIntensity = .72;
  lightingSky.material.dispose();
  generator.dispose();
  scene.add(sky);
  return sky;
}
