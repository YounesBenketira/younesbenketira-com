import * as THREE from './vendor/three.module.js';
import { addPatternMaterials } from './pattern-glow.js';

function canvasTexture(draw, repeatX = 1, repeatY = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  draw(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 8;
  return texture;
}

function drawStone(context) {
  context.fillStyle = '#f1e4cd';
  context.fillRect(0, 0, 512, 512);
  const colors = ['#f1e5d0', '#ecdfc8', '#eee2cc', '#f4e8d4', '#eee0ca'];
  for (let row = 0; row < 16; row += 1) {
    for (let column = -1; column < 8; column += 1) {
      const x = column * 64 + row % 2 * 32;
      const colorIndex = (row * 7 + column + 10) % colors.length;
      context.fillStyle = colors[colorIndex];
      context.fillRect(x + .6, row * 32 + .6, 63, 31);
    }
  }
  for (let index = 0; index < 4200; index += 1) {
    const x = index * 137.13 % 512;
    const y = index * 79.79 % 512;
    context.fillStyle = 'rgba(133,109,70,.055)';
    context.fillRect(x, y, 2 + index % 11, .6);
  }
}

function drawGold(context) {
  const colors = ['#d8ab49', '#bf8c2e', '#e4c46d', '#b98727', '#d9b459'];
  context.fillStyle = '#bd8b2f';
  context.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 4) {
    context.fillStyle = colors[x / 4 % colors.length];
    context.fillRect(x, 0, 3.1, 512);
    context.fillStyle = '#785522';
    context.fillRect(x + 3.1, 0, .6, 512);
  }
}

function drawFrieze(context) {
  context.fillStyle = '#e6d5b9';
  context.fillRect(0, 0, 512, 512);
  context.strokeStyle = '#b5a180';
  context.lineWidth = 5;
  for (let x = 0; x < 512; x += 32) {
    context.strokeRect(x + 5, 95, 22, 322);
    context.strokeRect(x + 11, 130, 10, 252);
  }
  context.strokeRect(0, 75, 512, 362);
}

function drawGrass(context) {
  context.fillStyle = '#6f8250';
  context.fillRect(0, 0, 512, 512);
  const colors = ['#6c8246', '#718554', '#80925c', '#667b42', '#919768'];
  for (let index = 0; index < 18000; index += 1) {
    context.fillStyle = colors[index % colors.length];
    const x = index * 137.231 % 512;
    const y = index * 63.717 % 512;
    context.fillRect(x, y, 1, 2 + index % 4);
  }
}

function drawLattice(context) {
  context.fillStyle = '#75817a';
  context.fillRect(0, 0, 512, 512);
  context.strokeStyle = '#e0d6bc';
  context.lineWidth = 5;
  for (let y = -64; y <= 576; y += 64) {
    for (let x = -64; x <= 576; x += 64) {
      context.beginPath();
      for (let point = 0; point <= 16; point += 1) {
        const angle = point * Math.PI / 8;
        const radius = point % 2 === 0 ? 31 : 19;
        const pointX = x + Math.cos(angle) * radius;
        const pointY = y + Math.sin(angle) * radius;
        context.lineTo(pointX, pointY);
      }
      context.stroke();
      context.strokeRect(x - 23, y - 23, 46, 46);
    }
  }
}

function drawTiles(context) {
  context.fillStyle = '#ede8dc';
  context.fillRect(0, 0, 512, 512);
  context.strokeStyle = '#c7c7b7';
  context.lineWidth = 1;
  for (let index = 0; index <= 512; index += 64) {
    context.beginPath();
    context.moveTo(index, 0);
    context.lineTo(index, 512);
    context.moveTo(0, index);
    context.lineTo(512, index);
    context.stroke();
  }
  context.strokeStyle = '#b5bda9';
  context.lineWidth = 2;
  context.strokeRect(8, 8, 496, 496);
}

function drawMinaretCarving(context, emission = false) {
  context.fillStyle = emission ? '#000000' : '#ede8de';
  context.fillRect(0, 0, 512, 512);
  const outline = [[256, 0], [334, 94], [418, 94], [418, 178], [512, 256], [418, 334], [418, 418], [334, 418], [256, 512], [178, 418], [94, 418], [94, 334], [0, 256], [94, 178], [94, 94], [178, 94]];
  for (const scale of [1, .72]) {
    context.beginPath();
    outline.forEach(([x, y], index) => {
      const px = 256 + (x - 256) * scale;
      const py = 256 + (y - 256) * scale;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    context.closePath();
    context.strokeStyle = emission ? '#ffffff' : '#b4afa3';
    context.lineWidth = 10;
    context.stroke();
    context.strokeStyle = emission ? '#ffffff' : '#faf6ec';
    context.lineWidth = 4;
    context.stroke();
  }
}

export function createMaterials() {
  const stoneTexture = canvasTexture(drawStone, 6, 3);
  const latticeTexture = canvasTexture(drawLattice, 2, 4);
  const domeTexture = canvasTexture(drawGold, 4, 1);
  const friezeTexture = canvasTexture(drawFrieze, 12, 1);
  const tilesTexture = canvasTexture(drawTiles, 6, 12);
  const grassTexture = canvasTexture(drawGrass, 5, 25);
  const minaretCarving = canvasTexture(drawMinaretCarving, 1, 110);
  const minaretHeader = canvasTexture(drawMinaretCarving, 1, 12);
  const carvingMask = canvasTexture((context) => drawMinaretCarving(context, true), 1, 110);
  const headerMask = carvingMask.clone();
  headerMask.repeat.set(1, 12);
  const minaretWindows = Array.from({ length: 4 }, () => new THREE.MeshPhysicalMaterial({
    color: '#406f91', roughness: .28, metalness: 0, clearcoat: .35,
    emissive: '#63c9ff', emissiveIntensity: 0,
  }));
  return addPatternMaterials({
    stone: new THREE.MeshStandardMaterial({ map: stoneTexture, bumpMap: stoneTexture, bumpScale: .11, roughness: .78 }),
    ivory: new THREE.MeshStandardMaterial({ color: '#fff4dc', roughness: .48 }),
    trim: new THREE.MeshStandardMaterial({ color: '#d4c4a2', roughness: .7 }),
    lattice: new THREE.MeshStandardMaterial({ map: latticeTexture, roughness: .65 }),
    dome: new THREE.MeshStandardMaterial({ emissive: '#ffc04d', emissiveIntensity: 0, map: domeTexture, bumpMap: domeTexture, bumpScale: .035, roughness: .29, metalness: .72 }),
    minaretWindows,
    crownGlass: new THREE.MeshPhysicalMaterial({ color: '#416d8b', metalness: 0, roughness: .2, clearcoat: .35, emissive: '#ffc04d', emissiveIntensity: 0 }),
    mullion: new THREE.MeshStandardMaterial({ color: '#344b50', metalness: .5, roughness: .35 }),
    door: new THREE.MeshStandardMaterial({ color: '#32362b', roughness: .62 }),
    entranceBronze: new THREE.MeshStandardMaterial({ map: latticeTexture, color: '#a98048', metalness: .55, roughness: .5 }),
    entranceBlack: new THREE.MeshStandardMaterial({ color: '#080909', roughness: .9 }),
    screenStone: new THREE.MeshStandardMaterial({ color: '#997444', roughness: .67, metalness: .18 }),
    screenShadow: new THREE.MeshStandardMaterial({ color: '#202725', roughness: .96 }),
    minaretCarving: new THREE.MeshStandardMaterial({ map: minaretCarving, bumpMap: minaretCarving, bumpScale: .015, roughness: .85 }),
    minaretHeader: new THREE.MeshStandardMaterial({ map: minaretHeader, bumpMap: minaretHeader, bumpScale: .015, roughness: .85 }),
    frieze: new THREE.MeshStandardMaterial({ map: friezeTexture, roughness: .8 }),
    dark: new THREE.MeshStandardMaterial({ color: '#394b44', roughness: .6 }),
    gold: new THREE.MeshStandardMaterial({ color: '#e7b64e', metalness: .78, roughness: .24 }),
    tiles: new THREE.MeshStandardMaterial({ map: tilesTexture, bumpMap: tilesTexture, bumpScale: .06, roughness: .31 }),
    lawn: new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 1 }),
    leaf: new THREE.MeshStandardMaterial({ color: '#39622c', roughness: .85, side: THREE.DoubleSide }),
    trunk: new THREE.MeshStandardMaterial({ color: '#9e9273', roughness: 1 }),
    paving: new THREE.MeshPhysicalMaterial({ color: '#e7dfce', roughness: .36, clearcoat: .3 }),
    inlay: new THREE.MeshStandardMaterial({ color: '#768376', roughness: .3 }),
    joint: new THREE.MeshStandardMaterial({ color: '#bdb8a6', roughness: 1 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#fff0cc', emissive: '#d9b975', emissiveIntensity: .25 }),
  }, carvingMask, headerMask);
}
