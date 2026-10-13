import * as THREE from './vendor/three.module.js';
import { box } from './architecture.js';
import { beams } from './ornament.js';

function roofDetails(parent, materials) {
  const segments = [];
  for (let x = -45; x <= 45; x += 5) {
    const start = new THREE.Vector3(x, 31.69, -125);
    const end = new THREE.Vector3(x, 31.69, -31);
    segments.push([start, end]);
  }
  for (let z = -123; z < -28; z += 5) {
    const start = new THREE.Vector3(-47, 31.69, z);
    const end = new THREE.Vector3(47, 31.69, z);
    segments.push([start, end]);
  }
  beams(parent, segments, materials.joint, .045);
}

function courtyardTrim(parent, materials) {
  for (const x of [-37, 37]) box(parent, materials.inlay, [.22, .05, 103], [x, .85, 29]);
  for (const z of [-20, 77]) box(parent, materials.inlay, [74, .05, .22], [0, .85, z]);
  for (let z = -15; z < 77; z += 10) {
    for (const x of [-38.4, 38.4]) {
      const tile = box(parent, materials.inlay, [.8, .05, .8], [x, .88, z]);
      tile.rotation.y = Math.PI / 4;
    }
  }
}

function streetFurniture(parent, materials) {
  const postGeometry = new THREE.CylinderGeometry(.12, .18, 7.2, 8);
  const lampGeometry = new THREE.SphereGeometry(.55, 10, 8);
  for (const x of [-67, 67]) {
    for (let z = -120; z <= 160; z += 35) {
      const post = new THREE.Mesh(postGeometry, materials.dark);
      post.position.set(x, 3.6, z);
      post.castShadow = true;
      parent.add(post);
      const lamp = new THREE.Mesh(lampGeometry, materials.lamp);
      lamp.position.set(x, 7.2, z);
      parent.add(lamp);
      box(parent, materials.trim, [1, .15, 1], [x, .1, z]);
    }
  }
  for (const x of [-62, 62]) {
    for (const z of [-35, 10, 55, 105]) {
      box(parent, materials.ivory, [6, .7, 1.7], [x, 1.5, z]);
      box(parent, materials.dark, [.6, 1, 1.5], [x - 2.2, .9, z]);
      box(parent, materials.dark, [.6, 1, 1.5], [x + 2.2, .9, z]);
    }
  }
}

export function addDetails(parent, materials) {
  roofDetails(parent, materials);
  courtyardTrim(parent, materials);
  streetFurniture(parent, materials);
}
