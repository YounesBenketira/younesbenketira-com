import * as THREE from './vendor/three.module.js';

export class ContextBatch {
  constructor() {
    this.positions = [];
    this.uvs = [];
    this.colors = [];
  }

  triangle(a, b, c, color, uv = [0, 0, 1, 0, 1, 1]) {
    this.positions.push(...a, ...b, ...c);
    this.uvs.push(...uv);
    for (let index = 0; index < 3; index += 1) this.colors.push(color.r, color.g, color.b);
  }

  mesh(material, fade = false) {
    const geometry = new THREE.BufferGeometry();
    const positions = new THREE.Float32BufferAttribute(this.positions, 3);
    const uvs = new THREE.Float32BufferAttribute(this.uvs, 2);
    const colors = new THREE.Float32BufferAttribute(this.colors, 3);
    geometry.setAttribute('position', positions);
    geometry.setAttribute('uv', uvs);
    geometry.setAttribute('color', colors);
    if (fade) {
      const flags = new Float32Array(positions.count).fill(1);
      const mask = new THREE.BufferAttribute(flags, 1);
      geometry.setAttribute('contextMask', mask);
    }
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
  }
}

export function surface(batch, points, height, color, holes = []) {
  if (points.length < 3) return;
  const contour = points.map(([x, z]) => new THREE.Vector2(x, z));
  const voids = holes.map((ring) => ring.map(([x, z]) => new THREE.Vector2(x, z)));
  const triangles = THREE.ShapeUtils.triangulateShape(contour, voids);
  const vertices = points.concat(...holes);
  for (const triangle of triangles) {
    const positions = triangle.map((index) => {
      const [x, z] = vertices[index];
      return [x, height(x, z), z];
    });
    batch.triangle(positions[0], positions[2], positions[1], color);
  }
}

export function ribbon(batch, points, width, elevation, color) {
  for (let index = 1; index < points.length; index += 1) {
    const [ax, az] = points[index - 1];
    const [bx, bz] = points[index];
    const dx = bx - ax;
    const dz = bz - az;
    const length = Math.hypot(dx, dz);
    if (length < .01) continue;
    const ox = -dz / length * width / 2;
    const oz = dx / length * width / 2;
    const a = [ax + ox, elevation(ax, az), az + oz];
    const b = [ax - ox, elevation(ax, az), az - oz];
    const c = [bx - ox, elevation(bx, bz), bz - oz];
    const d = [bx + ox, elevation(bx, bz), bz + oz];
    batch.triangle(a, c, b, color);
    batch.triangle(a, d, c, color);
  }
}

export function terrainSampler(terrain) {
  const { size, extent, h } = terrain;
  return (x, z) => {
    const col = THREE.MathUtils.clamp((x + extent) / (2 * extent) * (size - 1), 0, size - 1);
    const row = THREE.MathUtils.clamp((z + extent) / (2 * extent) * (size - 1), 0, size - 1);
    const x0 = Math.floor(col);
    const z0 = Math.floor(row);
    const x1 = Math.min(size - 1, x0 + 1);
    const z1 = Math.min(size - 1, z0 + 1);
    const lower = THREE.MathUtils.lerp(h[z0 * size + x0], h[z0 * size + x1], col - x0);
    const upper = THREE.MathUtils.lerp(h[z1 * size + x0], h[z1 * size + x1], col - x0);
    return THREE.MathUtils.lerp(lower, upper, row - z0);
  };
}

export function terrainMesh(terrain, material) {
  const { size, extent, h } = terrain;
  const geometry = new THREE.PlaneGeometry(extent * 2, extent * 2, size - 1, size - 1);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colors = [];
  for (let index = 0; index < positions.count; index += 1) {
    positions.setY(index, h[index]);
    const color = new THREE.Color('#c6c3ac');
    const green = THREE.MathUtils.smoothstep(h[index], 10, 100) * .45;
    color.lerp(new THREE.Color('#91a185'), green);
    colors.push(color.r, color.g, color.b);
  }
  const attribute = new THREE.Float32BufferAttribute(colors, 3);
  geometry.setAttribute('color', attribute);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}
