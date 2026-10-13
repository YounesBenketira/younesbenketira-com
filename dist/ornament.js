import * as THREE from './vendor/three.module.js';

const beamGeometry = new THREE.BoxGeometry(1, 1, 1);
const up = new THREE.Vector3(0, 1, 0);

export function beams(parent, segments, material, thickness = .1) {
  const mesh = new THREE.InstancedMesh(beamGeometry, material, segments.length);
  const transform = new THREE.Object3D();
  const direction = new THREE.Vector3();
  segments.forEach(([start, end], index) => {
    direction.subVectors(end, start);
    const length = direction.length();
    transform.position.copy(start).add(end).multiplyScalar(.5);
    direction.normalize();
    transform.quaternion.setFromUnitVectors(up, direction);
    transform.scale.set(thickness, length, thickness);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function starPoints(x, y, radius, z) {
  const points = [];
  for (let corner = 0; corner < 16; corner += 1) {
    const angle = corner * Math.PI / 8;
    const length = corner % 2 === 0 ? radius : radius * .55;
    const px = x + Math.cos(angle) * length;
    const py = y + Math.sin(angle) * length;
    points.push(new THREE.Vector3(px, py, z));
  }
  return points;
}

function domePoint(theta, phi) {
  const radius = 16.67 * Math.sin(theta);
  const x = radius * Math.cos(phi);
  const y = 32 + 14.48 * Math.cos(theta);
  const z = -78 + radius * Math.sin(phi);
  return new THREE.Vector3(x, y, z);
}

function domeRibs(parent, materials) {
  for (let rib = 0; rib < 8; rib += 1) {
    const points = [];
    for (let step = 0; step <= 48; step += 1) {
      const point = domePoint(step / 48 * Math.PI / 2, rib * Math.PI / 4);
      points.push(point);
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 64, .24, 8, false);
    const mesh = new THREE.Mesh(geometry, materials.ivory);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
  }
}

export function domeFiligree(parent, materials) {
  const segments = [];
  const motif = [[0,-1],[.26,-.8],[.38,-.5],[.66,-.5],[.66,-.26],[1,0],[.66,.26],[.66,.5],[.38,.5],[.26,.8],[0,1],[-.26,.8],[-.38,.5],[-.66,.5],[-.66,.26],[-1,0],[-.66,-.26],[-.66,-.5],[-.38,-.5],[-.26,-.8]];
  for (let row = 1; row <= 7; row += 1) {
    const theta = row / 8 * Math.PI / 2;
    const columns = 8 + row * 4;
    for (let column = 0; column < columns; column += 1) {
      const phi = (column + row % 2 * .5) / columns * Math.PI * 2;
      const points = motif.map(([x, y]) => domePoint(theta + y * .094, phi + x * Math.PI / columns));
      points.forEach((point, index) => segments.push([point, points[(index + 1) % points.length]]));
    }
  }
  beams(parent, segments, materials.ivory, .105);
  domeRibs(parent, materials);
}

export function pavingRosette(parent, materials, x, z, radius) {
  const segments = [];
  for (let ring = 0; ring < 3; ring += 1) {
    const points = starPoints(0, 0, radius - ring * 2, 0);
    const rotated = points.map((point) => new THREE.Vector3(x + point.x, .835, z + point.y));
    rotated.forEach((point, index) => segments.push([point, rotated[(index + 1) % 16]]));
  }
  beams(parent, segments, materials.inlay, .04);
}
