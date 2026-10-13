import * as THREE from './vendor/three.module.js';

function roundedOctagram(path, outer, inner) {
  const points = [];
  for (let corner = 0; corner < 16; corner += 1) {
    const angle = corner * Math.PI / 8;
    const radius = corner % 2 === 0 ? outer : inner;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push(new THREE.Vector2(x, y));
  }
  const start = points[0].clone().lerp(points[15], .18);
  path.moveTo(start.x, start.y);
  points.forEach((point, index) => {
    const before = point.clone().lerp(points[(index + 15) % 16], .18);
    const after = point.clone().lerp(points[(index + 1) % 16], .18);
    path.lineTo(before.x, before.y);
    path.quadraticCurveTo(point.x, point.y, after.x, after.y);
  });
  path.closePath();
}

function ribbonGeometry() {
  const shape = new THREE.Shape();
  roundedOctagram(shape, .55, .421);
  const opening = new THREE.Path();
  roundedOctagram(opening, .505, .386);
  shape.holes.push(opening);
  return new THREE.ExtrudeGeometry(shape, {
    depth: .12, bevelEnabled: false, curveSegments: 3,
  });
}

const ribbon = ribbonGeometry();

export function latticeScreen(parent, materials, width, height, y, z) {
  const columns = 12;
  const rows = Math.round(height / width * columns);
  const cellWidth = (width - .12) / columns;
  const cellHeight = (height - .12) / rows;
  const mesh = new THREE.InstancedMesh(ribbon, materials.screenStone, columns * rows);
  const transform = new THREE.Object3D();
  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = (column - (columns - 1) / 2) * cellWidth;
      const cy = y + (row - (rows - 1) / 2) * cellHeight;
      transform.position.set(x, cy, z);
      transform.scale.set(cellWidth, cellHeight, 1);
      transform.updateMatrix();
      mesh.setMatrixAt(index++, transform.matrix);
    }
  }
  mesh.name = 'Minaret interlocking mashrabiya';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
