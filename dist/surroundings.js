import * as THREE from './vendor/three.module.js';
import { ContextBatch, surface, ribbon, terrainSampler, terrainMesh } from './context-geometry.js';
import { contextMaterials, openingVisibility } from './context-materials.js';

const palette = ['#eee8da', '#e5d8c4', '#c9ccc5', '#eadac9', '#e0e4de', '#d5c6b3'];

function centerOf(points) {
  const center = new THREE.Vector2();
  for (const [x, z] of points) center.add(new THREE.Vector2(x, z));
  return center.divideScalar(points.length);
}

function buildingWalls(batch, points, base, height, color) {
  for (let index = 0; index < points.length; index += 1) {
    const [ax, az] = points[index];
    const [bx, bz] = points[(index + 1) % points.length];
    const length = Math.hypot(bx - ax, bz - az);
    const widthUv = length / 2.5;
    const heightUv = height / 2.3;
    const a = [ax, base, az];
    const b = [bx, base, bz];
    const c = [bx, base + height, bz];
    const d = [ax, base + height, az];
    batch.triangle(a, b, c, color, [0, 0, widthUv, 0, widthUv, heightUv]);
    batch.triangle(a, c, d, color, [0, 0, widthUv, heightUv, 0, heightUv]);
  }
}

function addBuilding(tile, building, ground) {
  const center = centerOf(building.p);
  const base = ground(center.x, center.y) + .15;
  const height = building.h;
  const color = new THREE.Color(palette[building.id % palette.length]);
  buildingWalls(tile.walls, building.p, base, height, color);
  for (const hole of building.holes) buildingWalls(tile.walls, hole, base, height, color);
  const roof = color.clone().multiplyScalar(.78);
  surface(tile.roofs, building.p, () => base + height, roof, building.holes);
}

function addBuildings(group, data, materials, ground) {
  const tiles = new Map();
  for (const building of data.buildings) {
    // This footprint closes the open approach behind the minaret in the reference photo.
    if (building.id === 1311601128) continue;
    const center = centerOf(building.p);
    const key = `${Math.floor(center.x / 650)}:${Math.floor(center.y / 650)}`;
    if (!tiles.has(key)) tiles.set(key, { walls: new ContextBatch(), roofs: new ContextBatch(), center });
    addBuilding(tiles.get(key), building, ground);
  }
  for (const tile of tiles.values()) {
    const walls = tile.walls.mesh(materials.walls, true);
    const roofs = tile.roofs.mesh(materials.roofs, true);
    group.add(walls, roofs);
  }
}

function addRoads(group, data, material, ground) {
  const streets = new ContextBatch();
  const curbs = new ContextBatch();
  const markings = new ContextBatch();
  const asphalt = new THREE.Color('#929796');
  const curb = new THREE.Color('#d5d1c1');
  const path = new THREE.Color('#d6cbb6');
  const white = new THREE.Color('#e9e4cb');
  const pedestrian = new Set(['footway', 'path', 'pedestrian', 'steps']);
  for (const road of data.roads) {
    const elevation = road.bridge ? 3.2 : 0;
    const height = (x, z) => ground(x, z) + elevation;
    ribbon(curbs, road.p, road.w + 1.1, (x, z) => height(x, z) + .12, curb);
    const color = pedestrian.has(road.kind) ? path : asphalt;
    ribbon(streets, road.p, road.w, (x, z) => height(x, z) + .17, color);
    if (road.kind !== 'motorway' && road.kind !== 'trunk') continue;
    ribbon(markings, road.p, .13, (x, z) => height(x, z) + .19, white);
  }
  for (const batch of [curbs, streets, markings]) group.add(batch.mesh(material));
}

function addLand(group, data, materials, ground) {
  group.add(terrainMesh(data.terrain, materials.flat));
  const surfaces = new ContextBatch();
  const greens = new Set(['grass', 'forest', 'meadow', 'park', 'recreation_ground', 'orchard', 'village_green']);
  for (const area of data.surfaces) {
    if (!greens.has(area.kind)) continue;
    const color = new THREE.Color('#91a077');
    surface(surfaces, area.p, (x, z) => ground(x, z) + .08, color);
  }
  const paving = new THREE.Color('#ded6c3');
  surface(surfaces, data.site, () => -.5, paving);
  group.add(surfaces.mesh(materials.flat));
  const sea = new ContextBatch();
  const white = new THREE.Color('#ffffff');
  surface(sea, data.sea.p, () => data.terrain.sea, white);
  const water = sea.mesh(materials.water);
  water.receiveShadow = false;
  group.add(water);
  const river = new ContextBatch();
  for (const channel of data.rivers) ribbon(river, channel.p, channel.w, (x, z) => ground(x, z) + .3, white);
  group.add(river.mesh(materials.water));
}

function addTrees(group, data, material, ground) {
  const positions = [];
  const greenKinds = new Set(['park', 'forest', 'grass', 'recreation_ground']);
  for (const area of data.surfaces) {
    if (!greenKinds.has(area.kind)) continue;
    const center = centerOf(area.p);
    if (center.length() > 2200) continue;
    for (let index = 0; index < area.p.length; index += 3) {
      const [x, z] = area.p[index];
      const insideWidth = Math.abs(x) < 100;
      const insideLength = z > -160 && z < 260;
      if (insideWidth && insideLength) continue;
      positions.push([x, ground(x, z) + 3, z]);
    }
  }
  const geometry = new THREE.IcosahedronGeometry(1, 1);
  const flags = new Float32Array(geometry.attributes.position.count).fill(1);
  const mask = new THREE.BufferAttribute(flags, 1);
  geometry.setAttribute('contextMask', mask);
  const trees = new THREE.InstancedMesh(geometry, material, positions.length);
  const transform = new THREE.Object3D();
  positions.forEach(([x, y, z], index) => {
    transform.position.set(x, y, z);
    transform.scale.set(2.3, 3.6, 2.3);
    transform.updateMatrix();
    trees.setMatrixAt(index, transform.matrix);
  });
  trees.computeBoundingSphere();
  group.add(trees);
}

export async function loadSurroundings(world) {
  const response = await fetch('./data/algiers-context.json');
  if (!response.ok) throw new Error(`Surroundings data returned ${response.status}`);
  const data = await response.json();
  const group = new THREE.Group();
  group.name = 'Mapped Algiers surroundings';
  const materials = contextMaterials();
  const ground = terrainSampler(data.terrain);
  addLand(group, data, materials, ground);
  addRoads(group, data, materials.flat, ground);
  addBuildings(group, data, materials, ground);
  addTrees(group, data, materials.leaves, ground);
  world.scene.add(group);
  world.contextRadius = materials.radius;
  openingVisibility(world.composer.contextNormal, materials.radius);
  world.context = { buildings: data.buildings.length, roads: data.roads.length, timestamp: data.meta.osmTimestamp };
  world.renderer.shadowMap.needsUpdate = true;
  world.needsRender = true;
}
