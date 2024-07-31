import * as CANNON from "cannon-es";
import * as THREE from "three";
import { PhysicsObject } from "../PhysicsObject";

export const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();

export function toCanonVec3(v: THREE.Vector3) {
  return new CANNON.Vec3(v.x, v.y, v.z);
}

export function createPaddlePhysicsObject(
  position: THREE.Vector3
): PhysicsObject {
  const shape = new CANNON.Cylinder(0.5, 0.5, 0.6, 32);
  const body = new CANNON.Body({ mass: 50 });
  body.addShape(shape);
  body.position.copy(toCanonVec3(position));
  body.material = new CANNON.Material({ friction: 1.0, restitution: 0.1 });
  body.angularDamping = 1;

  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.0,
    reflectivity: 1,
    sheen: 0.5,
    clearcoat: 1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.copy(position);

  return new PhysicsObject(mesh, body);
}

export function createPuckPhysicsObject(
  position: THREE.Vector3
): PhysicsObject {
  const shape = new CANNON.Cylinder(0.4, 0.4, 0.25, 32);
  const body = new CANNON.Body({ mass: 50 });
  body.addShape(shape);
  body.position.copy(toCanonVec3(position));
  body.quaternion.setFromEuler(0, Math.PI / 2, 0);
  body.material = new CANNON.Material({ friction: 0.5, restitution: 0.0 });
  body.angularDamping = 1;

  const geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    roughness: 0.1,
    metalness: 0.0,
    reflectivity: 1,
    sheen: 0.5,
    clearcoat: 1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.copy(position);

  return new PhysicsObject(mesh, body);
}

export function addGroundPlane(world: CANNON.World) {
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.material = new CANNON.Material({
    friction: 0.0,
    restitution: 0.2,
  });
  world.addBody(groundBody);
}

function createWall(
  world: CANNON.World,
  scene: THREE.Scene,
  width: number,
  height: number,
  depth: number,
  position: CANNON.Vec3,
  color: number
): void {
  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, depth / 2)
  );
  const body = new CANNON.Body({ mass: 0 });
  body.addShape(shape);
  body.position.copy(position);
  world.addBody(body);

  const geometry = new THREE.BoxGeometry(width, 2, depth);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(body.position.x, 0, body.position.z);

  scene.add(mesh);
}

export function addWalls(
  world: CANNON.World,
  scene: THREE.Scene,
  canvas: HTMLCanvasElement
): void {
  const wallThickness = 1;
  const width = canvas.clientWidth / 120;
  const height = canvas.clientHeight / 120;
  const wallHeight = 50;
  const color = 0x00ff00;

  // Top
  createWall(
    world,
    scene,
    width * 2,
    wallHeight,
    wallThickness,
    new CANNON.Vec3(0, wallHeight / 2, height + wallThickness),
    color
  );

  // Bottom
  createWall(
    world,
    scene,
    width * 2,
    wallHeight,
    wallThickness,
    new CANNON.Vec3(0, wallHeight / 2, -height - wallThickness),
    color
  );

  // Left
  createWall(
    world,
    scene,
    wallThickness,
    wallHeight,
    height * 2,
    new CANNON.Vec3(-width - wallThickness, wallHeight / 2, 0),
    color
  );

  // Right
  createWall(
    world,
    scene,
    wallThickness,
    wallHeight,
    height * 2,
    new CANNON.Vec3(width + wallThickness, wallHeight / 2, 0),
    color
  );
}
