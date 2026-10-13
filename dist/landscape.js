import * as THREE from './vendor/three.module.js';
import { box } from './architecture.js';

function palmGeometry() {
  const positions = [];
  for (let segment = 0; segment < 26; segment += 1) {
    const fraction = segment / 26;
    const distance = fraction * 9.5;
    const height = Math.sin(fraction * Math.PI) * 1.5 - fraction * fraction * 3;
    const width = Math.sin(fraction * Math.PI) * 2.2 + .06;
    for (const side of [-1, 1]) {
      const tip = width * side;
      positions.push(distance, height, 0, distance + 1.2, height - .45, tip, distance + .38, height + .04, 0);
      positions.push(distance + .38, height + .04, 0, distance + 1.2, height - .45, tip, distance + .7, height - .3, tip * .93);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createPalm(materials, leafGeometry, x, z, variation) {
  const palm = new THREE.Group();
  palm.position.set(x, 1, z);
  const height = 12 + variation * 3;
  const trunkGeometry = new THREE.CylinderGeometry(.4, .7, height, 12, 14);
  const trunk = new THREE.Mesh(trunkGeometry, materials.trunk);
  trunk.position.y = height / 2;
  trunk.castShadow = true;
  palm.add(trunk);
  for (let index = 0; index < 21; index += 1) {
    const leaf = new THREE.Mesh(leafGeometry, materials.leaf);
    leaf.position.y = height;
    leaf.rotation.y = index * 2.399 + variation;
    leaf.rotation.z = index / 21 * .85 - .15;
    leaf.castShadow = true;
    palm.add(leaf);
  }
  return palm;
}

function courtyardTrees(parent, materials) {
  const trunk = new THREE.CylinderGeometry(.09, .16, 3.6, 8);
  const crown = new THREE.IcosahedronGeometry(1, 2);
  const planter = new THREE.CylinderGeometry(1.1, 1, .5, 24);
  for (const x of [-25, 25]) {
    for (const z of [-1, 12, 42, 55]) {
      const base = new THREE.Mesh(planter, materials.ivory);
      base.position.set(x, 1.05, z);
      parent.add(base);
      const stem = new THREE.Mesh(trunk, materials.trunk);
      stem.position.set(x, 2.7, z);
      parent.add(stem);
      const foliage = new THREE.Mesh(crown, materials.leaf);
      foliage.position.set(x, 4.7, z);
      foliage.scale.set(1.4, 1.3, 1.5);
      foliage.castShadow = true;
      parent.add(foliage);
    }
  }
}

function gardens(parent, materials) {
  const leafGeometry = palmGeometry();
  for (const x of [-83, 83]) {
    box(parent, materials.lawn, [28, .25, 352], [x, .25, 43]);
    for (let index = 0; index < 10; index += 1) {
      const z = -114 + index * 34;
      const palm = createPalm(materials, leafGeometry, x, z, (index % 3) * .3);
      palm.scale.setScalar(.8);
      parent.add(palm);
      box(parent, materials.paving, [6, .2, 6], [x, .45, z]);
    }
  }
  courtyardTrees(parent, materials);
}

function visitors(parent, materials) {
  const bodyGeometry = new THREE.CylinderGeometry(.25, .4, 1.3, 6);
  const headGeometry = new THREE.SphereGeometry(.23, 6, 5);
  const positions = [[-12,69],[4,61],[6,63],[17,101],[-8,117],[22,-15],[-33,55],[33,82]];
  for (const [x, z] of positions) {
    const person = new THREE.Mesh(bodyGeometry, materials.dark);
    person.position.set(x, 1.55, z);
    person.castShadow = true;
    parent.add(person);
    const head = new THREE.Mesh(headGeometry, materials.trim);
    head.position.set(x, 2.4, z);
    parent.add(head);
  }
}

export function createLandscape(materials) {
  const ground = new THREE.Group();
  box(ground, materials.paving, [138, .65, 377], [0, -.2, 48]);
  box(ground, materials.tiles, [134, .5, 373], [0, .1, 48]);
  box(ground, materials.tiles, [114, .3, 70], [0, .5, 215]);
  box(ground, materials.paving, [110, .2, 160], [0, -.25, -210]);
  gardens(ground, materials);
  visitors(ground, materials);
  return ground;
}
