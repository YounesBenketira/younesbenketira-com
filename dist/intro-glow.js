import * as THREE from './vendor/three.module.js';
import { ShaderPass } from './vendor/addons/postprocessing/ShaderPass.js';
import { glowShader, createOutlineMask } from './intro-glow-shader.js';

export class IntroGlowPass extends ShaderPass {
  constructor(scene, camera, sceneDepth, layer = 1) {
    super(glowShader);
    this.scene = scene;
    this.camera = camera;
    this.layer = layer;
    this.materialMask = createOutlineMask();
    const depthTexture = new THREE.DepthTexture(1, 1);
    this.mask = new THREE.WebGLRenderTarget(1, 1, { depthTexture });
    this.uniforms.silhouette.value = this.mask.texture;
    this.uniforms.outlineDepth.value = this.mask.depthTexture;
    this.uniforms.sceneDepth.value = sceneDepth;
  }

  setSize(width, height) {
    this.mask.setSize(width, height);
    this.uniforms.pixelSize.value.set(1 / width, 1 / height);
  }

  renderMask(renderer) {
    const target = renderer.getRenderTarget();
    const clearColor = renderer.getClearColor(new THREE.Color());
    const clearAlpha = renderer.getClearAlpha();
    const shadows = renderer.shadowMap.enabled;
    const layers = this.camera.layers.mask;
    const background = this.scene.background;
    const override = this.scene.overrideMaterial;
    try {
      this.camera.layers.set(this.layer);
      this.scene.background = null;
      this.scene.overrideMaterial = this.materialMask;
      renderer.shadowMap.enabled = false;
      renderer.setRenderTarget(this.mask);
      renderer.setClearColor('#000000', 0);
      renderer.clear();
      renderer.render(this.scene, this.camera);
    } finally {
      this.camera.layers.mask = layers;
      this.scene.background = background;
      this.scene.overrideMaterial = override;
      renderer.shadowMap.enabled = shadows;
      renderer.setClearColor(clearColor, clearAlpha);
      renderer.setRenderTarget(target);
    }
  }

  render(renderer, writeBuffer, readBuffer) {
    this.uniforms.cameraNear.value = this.camera.near;
    this.uniforms.cameraFar.value = this.camera.far;
    this.renderMask(renderer);
    super.render(renderer, writeBuffer, readBuffer);
  }

  dispose() {
    this.mask.dispose();
    this.materialMask.dispose();
    super.dispose();
  }
}
