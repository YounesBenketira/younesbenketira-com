import * as THREE from './vendor/three.module.js';
import { domeFiligree, pavingRosette } from './ornament.js';
import { latticeScreen } from './minaret-screen.js';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
export const minaretPosition = Object.freeze({ x: -27, z: 140 });

export function box(parent, material, size, position) {
  const mesh = new THREE.Mesh(unitBox, material);
  mesh.scale.set(...size);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function place(parent, geometry, material, position) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function columnGeometry(height) {
  const profile = [[.62,0],[.62,1],[.57,height*.65],[.7,height*.78],[1.3,height*.87],[2.3,height*.94],[3.8,height*.99],[4.5,height]];
  const positions = [];
  const indices = [];
  profile.forEach(([radius, y], row) => {
    for (let segment = 0; segment <= 16; segment += 1) {
      const angle = segment / 16 * Math.PI * 2;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const squareRadius = radius / Math.max(Math.abs(cosine), Math.abs(sine));
      const blend = Math.max(0, y / height - .65) / .35;
      const shapeRadius = THREE.MathUtils.lerp(radius, squareRadius, blend);
      positions.push(cosine * shapeRadius, y, sine * shapeRadius);
      if (row === 0 || segment === 16) continue;
      const a = row * 17 + segment;
      indices.push(a, a - 17, a + 1, a + 1, a - 17, a - 16);
    }
  });
  const geometry = new THREE.BufferGeometry();
  const coordinates = new THREE.Float32BufferAttribute(positions, 3);
  geometry.setAttribute('position', coordinates);
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function colonnade(parent, materials, start, direction, count, height = 18) {
  const geometry = columnGeometry(height);
  for (let index = 0; index < count; index += 1) {
    const x = start[0] + direction[0] * index;
    const z = start[1] + direction[1] * index;
    place(parent, geometry, materials.ivory, [x, .7, z]);
    box(parent, materials.trim, [1.8, .3, 1.8], [x, .83, z]);
  }
}

function dome(container, materials) {
  const parent = new THREE.Group();
  container.add(parent);
  const base = new THREE.CylinderGeometry(16.7, 16.9, 1.4, 96);
  place(parent, base, materials.trim, [0, 31.4, -78]);
  const shellGeometry = new THREE.SphereGeometry(16.5, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  const shell = place(parent, shellGeometry, materials.dome, [0, 32, -78]);
  shell.scale.y = .87;
  domeFiligree(parent, materials);
  const finial = new THREE.CylinderGeometry(.1, .22, 3.4, 12);
  place(parent, finial, materials.gold, [0, 48, -78]);
  for (const y of [47, 47.9, 48.8]) {
    const bead = new THREE.SphereGeometry(.33, 16, 10);
    place(parent, bead, materials.gold, [0, y, -78]);
  }
  const crescent = new THREE.TorusGeometry(.55, .1, 10, 32, Math.PI * 1.45);
  const moon = place(parent, crescent, materials.gold, [0, 49.8, -78]);
  moon.rotation.z = -.22 * Math.PI;
  parent.traverse((object) => object.layers.enable(2));
}

function archShape(width, height) {
  const shape = new THREE.Shape();
  const shoulder = height - width * .68;
  shape.moveTo(-width / 2, 0);
  shape.lineTo(-width / 2, shoulder);
  shape.bezierCurveTo(-width / 2, height - width * .25, -width * .18, height - .3, 0, height);
  shape.bezierCurveTo(width * .18, height - .3, width / 2, height - width * .25, width / 2, shoulder);
  shape.lineTo(width / 2, 0);
  shape.closePath();
  return shape;
}

function portal(parent, materials, x, z, width = 5.1, height = 14.5) {
  const outer = archShape(width + .85, height + .5);
  const opening = archShape(width, height);
  outer.holes.push(opening);
  const frame = new THREE.ExtrudeGeometry(outer, { depth: 1.8, bevelEnabled: false, curveSegments: 20 });
  place(parent, frame, materials.trim, [x, .8, z + .08]);
  const innerGeometry = new THREE.ShapeGeometry(opening, 32);
  place(parent, innerGeometry, materials.lattice, [x, .8, z + .06]);
  box(parent, materials.gold, [width - .3, .045, .12], [x, 1.1, z + .18]);
  for (const dx of [-.2, .2]) box(parent, materials.gold, [.06, .9, .08], [x + dx, 3.8, z + .2]);
}

const recessOutline = [[-3.3, 15.4], [3.3, 15.4], [5.3, 31], [-5.3, 31]];

function facadeRecessGeometry() {
  const outer = recessOutline.map(([x, y]) => [x, y, 47]);
  const inner = [[-2.9, 15.65, 46.4], [2.9, 15.65, 46.4], [4.6, 30.75, 46.4], [-4.6, 30.75, 46.4]];
  const points = [...outer, ...inner];
  const indices = [4, 5, 6, 4, 6, 7];
  for (let index = 0; index < 4; index += 1) {
    const next = (index + 1) % 4;
    indices.push(index, next, next + 4, index, next + 4, index + 4);
  }
  const vertices = indices.flatMap((index) => points[index]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function upperHallFace(face, materials) {
  const wall = new THREE.Shape();
  wall.moveTo(-47, 14.9);
  wall.lineTo(47, 14.9);
  wall.lineTo(47, 31.25);
  wall.lineTo(-47, 31.25);
  wall.closePath();
  const recess = facadeRecessGeometry();
  for (let index = 0; index < 6; index += 1) {
    const x = (index - 2.5) * 14.4;
    const outline = recessOutline.map(([dx, y]) => new THREE.Vector2(x + dx, y));
    wall.holes.push(new THREE.Path(outline));
    place(face, recess, materials.stone, [x, 0, 0]);
  }
  place(face, new THREE.ShapeGeometry(wall), materials.stone, [0, 0, 47]);
}

function entranceDoor(parent, materials, x, z = 47.2, rotation = 0) {
  const door = new THREE.Group();
  door.position.set(x, 0, z);
  door.rotation.y = rotation;
  parent.add(door);
  box(door, materials.entranceBronze, [4.4, 6.3, .2], [0, 4.15, 0]);
  box(door, materials.lattice, [4.4, 5.2, .2], [0, 10, 0]);
  for (const offset of [-2.2, 0, 2.2]) {
    box(door, materials.trim, [.12, 6.3, .25], [offset, 4.15, .15]);
  }
  box(door, materials.trim, [4.5, .18, .3], [0, 7.35, .15]);
  for (const offset of [-.25, .25]) {
    box(door, materials.gold, [.09, .9, .15], [offset, 3.3, .3]);
  }
}

function recessedEntrance(face, materials) {
  box(face, materials.ivory, [32, .6, 10], [0, 14, 52]);
  for (let index = 0; index < 6; index += 1) {
    const x = (index - 2.5) * 5.4;
    box(face, materials.ivory, [.85, 13, 1.2], [x, 7.2, 56.4]);
    box(face, materials.trim, [1.15, .2, 1.5], [x, .9, 56.4]);
  }
  for (let index = -2; index <= 2; index += 1) {
    entranceDoor(face, materials, index * 5.4);
  }
  for (const side of [-1, 1]) {
    for (const z of [49.5, 54.5]) entranceDoor(face, materials, side * 15.8, z, -side * Math.PI / 2);
  }
  box(face, materials.tiles, [32, .18, 10], [0, .71, 52]);
  box(face, materials.trim, [33, .16, 2], [0, .72, 58]);
}

function lowerHallFace(face, materials, sideIndex) {
  box(face, materials.trim, [114, .65, 1.2], [0, 14.65, 56.6]);
  const archCount = sideIndex === 0 ? 3 : (sideIndex === 3 ? 5 : 0);
  for (let index = 0; index < archCount; index += 1) {
    const x = (index - (archCount - 1) / 2) * 5.4;
    portal(face, materials, x, 57.2, 4.4, 13.3);
  }
  if (sideIndex === 2) recessedEntrance(face, materials);
  if (sideIndex === 1) {
    for (const x of [-9, 0, 9]) box(face, materials.entranceBlack, [6.5, 12, .12], [x, 6.8, 57.08]);
  }
  for (const side of [-1, 1]) {
    box(face, materials.frieze, [39, .55, .2], [side * 36.5, 10.9, 57.12]);
    for (let index = 0; index < 6; index += 1) {
      const x = side * (20 + index * 6.1);
      box(face, materials.lattice, [3.5, 5.6, .12], [x, 3.9, 57.08]);
      box(face, materials.ivory, [.55, 7.1, .55], [x + side * 2.9, 4.25, 57.2]);
      for (const offset of [-1.8, -.6, .6, 1.8]) {
        box(face, materials.lattice, [.55, 1.5, .12], [x + offset, 9.1, 57.08]);
      }
    }
  }
}

function hallFace(parent, materials, sideIndex) {
  const face = new THREE.Group();
  face.position.z = -78;
  face.rotation.y = sideIndex * Math.PI / 2;
  upperHallFace(face, materials);
  box(face, materials.trim, [94, .3, .5], [0, 15.15, 47.15]);
  lowerHallFace(face, materials, sideIndex);
  if (sideIndex === 0) {
    colonnade(face, materials, [-47, 63.2], [9.4, 0], 11);
    box(face, materials.ivory, [114, .6, 10.4], [0, 19, 62.6]);
  }
  parent.add(face);
}

function prayerHall(parent, materials) {
  // Leave the front-center vestibule open behind the entrance pillars.
  box(parent, materials.stone, [114, 13.6, 104], [0, 7.5, -73]);
  for (const side of [-1, 1]) {
    box(parent, materials.stone, [41, 13.6, 10], [side * 36.5, 7.5, -130]);
  }
  box(parent, materials.ivory, [114.6, .6, 114.6], [0, 14.6, -78]);
  box(parent, materials.stone, [92, 16.35, 92], [0, 23.075, -78]);
  box(parent, materials.ivory, [94.6, .45, 94.6], [0, 31.45, -78]);
  for (let side = 0; side < 4; side += 1) {
    hallFace(parent, materials, side);
  }
  dome(parent, materials);
}

function minaretFace(parent, materials, rotation) {
  const side = new THREE.Group();
  side.rotation.y = rotation;
  parent.add(side);
  const carving = rotation === 0 ? materials.patternGlow.carving : materials.minaretCarving;
  const headerMaterial = rotation === 0 ? materials.patternGlow.header : materials.minaretHeader;
  for (let section = 0; section < 5; section += 1) {
    const y = 13.8 + section * 28.7;
    minaretPanel(side, materials, y, rotation === 0);
    if (section > 0) {
      minaretWindow(side, materials, y - 14.35, section - 1);
    }
  }
  for (const x of [-7.6, 7.6]) {
    box(side, carving, [1.2, 138.6, .04], [x, 72.1, 10.12]);
    box(side, materials.trim, [.07, 138.6, .05], [x - .74, 72.1, 10.15]);
    box(side, materials.trim, [.07, 138.6, .05], [x + .74, 72.1, 10.15]);
  }
  const header = box(side, headerMaterial, [1.2, 15.2, .04], [0, 141.9, 10.12]);
  header.rotation.z = Math.PI / 2;
  box(side, materials.trim, [16.8, .07, .05], [0, 142.9, 10.15]);
  const crown = new THREE.Group();
  side.add(crown);
  box(crown, materials.crownGlass, [18.6, 27.5, .35], [0, 158.2, 9.55]);
  for (let y = 145; y < 172; y += 1.4) box(crown, materials.mullion, [19.2, .055, .3], [0, y, 9.8]);
  for (let x = -9; x <= 9; x += 1.5) box(crown, materials.mullion, [.055, 27.5, .3], [x, 158.2, 9.8]);
  crown.traverse((object) => object.layers.enable(2));
}

function minaret(parent, materials) {
  const tower = new THREE.Group();
  tower.position.set(minaretPosition.x, .5, minaretPosition.z);
  parent.add(tower);
  box(tower, materials.stone, [21, 2, 21], [0, 1, 0]);
  box(tower, materials.stone, [19.8, 141.4, 19.8], [0, 72.7, 0]);
  for (const x of [-8, 8]) {
    for (const z of [-8, 8]) box(tower, materials.stone, [4.2, 139, 4.2], [x, 73, z]);
  }
  for (let side = 0; side < 4; side += 1) minaretFace(tower, materials, side * Math.PI / 2);
  box(tower, materials.ivory, [19.8, .8, 19.8], [0, 143.8, 0]);
  box(tower, materials.mullion, [19.8, .5, 19.8], [0, 172.3, 0]).layers.enable(2);
  box(tower, materials.ivory, [5, 25, 5], [0, 157, 0]);
}

function courtWing(parent, materials, side, start, count) {
  const x = side * 47;
  const length = (count - 1) * 9.4 + 10;
  const center = start + (count - 1) * 4.7;
  for (const offset of [-4.7, 4.7]) colonnade(parent, materials, [x + offset, start], [0, 9.4], count);
  box(parent, materials.ivory, [19, .6, length], [x, 19, center]);
  box(parent, materials.stone, [5, 12, length], [side * 54, 6.7, center]);
  for (let index = 0; index < count; index += 1) {
    box(parent, materials.lattice, [.2, 8, 3.6], [side * 51.4, 5.5, start + index * 9.4]);
  }
}

function courtyards(parent, materials) {
  box(parent, materials.tiles, [114, .6, 235], [0, .5, 87]);
  for (const side of [-1, 1]) {
    courtWing(parent, materials, side, -8, 10);
    courtWing(parent, materials, side, 86, 9);
  }
  for (const z of [78, 87]) colonnade(parent, materials, [-47, z], [9.4, 0], 11);
  box(parent, materials.ivory, [113, .7, 19], [0, 19, 82.5]);
  for (const z of [30, 127]) pavingRosette(parent, materials, 0, z, 14);
  for (const x of [-25, 25]) {
    for (const z of [8, 49]) box(parent, materials.trim, [4, .45, 4], [x, 1, z]);
  }
  entrancePergola(parent, materials);
}

function minaretPanel(parent, materials, y, facingClimb) {
  box(parent, materials.screenShadow, [8.6, 23.2, .12], [0, y, 9.96]);
  const grille = latticeScreen(parent, materials, 8.6, 23.2, y, 11.0);
  if (facingClimb) grille.material = materials.patternGlow.grille;
  for (const x of [-4.35, 4.35]) {
    box(parent, materials.screenStone, [.12, 23.4, 1.18], [x, y, 10.53]);
  }
  for (const offset of [-11.65, 11.65]) {
    box(parent, materials.screenStone, [8.8, .12, 1.18], [0, y + offset, 10.53]);
  }
}

function minaretWindow(parent, materials, y, level) {
  box(parent, materials.minaretWindows[level], [8.6, 5.5, .12], [0, y, 9.96]);
  for (const x of [-2.15, 0, 2.15]) {
    box(parent, materials.mullion, [.055, 5.5, .08], [x, y, 10.06]);
  }
  for (const offset of [-.9, .9]) {
    box(parent, materials.mullion, [8.6, .055, .08], [0, y + offset, 10.06]);
  }
}

function entrancePergola(parent, materials) {
  for (const z of [196, 214]) {
    colonnade(parent, materials, [-47, z], [9.4, 0], 11);
    box(parent, materials.ivory, [104, .6, .7], [0, 19, z]);
  }
  for (let x = -51.7; x <= 52; x += 4.7) {
    box(parent, materials.ivory, [.35, .6, 27.4], [x, 19, 205]);
  }
  for (const z of [191.3, 200.7, 209.3, 218.7]) {
    box(parent, materials.ivory, [104, .6, .35], [0, 19, z]);
  }
}

export function createArchitecture(materials) {
  const model = new THREE.Group();
  prayerHall(model, materials);
  courtyards(model, materials);
  minaret(model, materials);
  return model;
}
