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
  const shape = new CANNON.Cylinder(0.8, 0.8, 0.6, 32);
  const body = new CANNON.Body({ mass: 50 });
  body.addShape(shape);
  body.position.copy(toCanonVec3(position));
  body.material = new CANNON.Material({ friction: 1.0, restitution: 0.1 });
  body.angularDamping = 1;

  // Material
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.0,
    reflectivity: 1,
    sheen: 0.5,
    clearcoat: 1,
  });

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
  const baseMesh = new THREE.Mesh(baseGeometry, material);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, material);
  handleMesh.castShadow = true;
  handleMesh.receiveShadow = true;
  handleMesh.position.y = 0.4; // position handle on top of the base

  // Handle dome
  const domeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const domeMesh = new THREE.Mesh(domeGeometry, material);
  domeMesh.castShadow = true;
  domeMesh.receiveShadow = true;
  domeMesh.position.y = 0.6; // position dome on top of the handle

  const paddleMesh = new THREE.Group();
  paddleMesh.add(baseMesh);
  paddleMesh.add(handleMesh);
  paddleMesh.add(domeMesh);
  paddleMesh.position.copy(position);

  return new PhysicsObject(paddleMesh, body);
}

export function createPuckPhysicsObject(
  position: THREE.Vector3
): PhysicsObject {
  const NEON_COLORS = [0x7df9ff, 0xff6ec7, 0xccff00, 0x39ff14];

  const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];

  const shape = new CANNON.Cylinder(0.5, 0.5, 0.1, 32);
  const body = new CANNON.Body({ mass: 5 });
  body.addShape(shape);
  body.position.copy(toCanonVec3(position));
  body.quaternion.setFromEuler(0, Math.PI / 2, 0);
  body.material = new CANNON.Material({ friction: 0.5, restitution: 1 });
  body.angularDamping = 1;

  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.2,
    metalness: 0.5,
    transparent: true,
    opacity: 0.8,
    emissive: color,
    emissiveIntensity: 0.7, // Intensity of the emissive color
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.copy(position);

  return new PhysicsObject(mesh, body);
}

export function addGroundPlane(world: CANNON.World, scene: THREE.Scene): void {
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.material = new CANNON.Material({
    friction: 0.0,
    restitution: 0.2,
  });
  world.addBody(groundBody);

  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xfafafa,
    roughness: 0.3,
    metalness: 0.2,
    reflectivity: 0.4,
    sheen: 0.2,
    clearcoat: 0.8,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.rotateX(-Math.PI / 2);
  scene.add(mesh);
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
  const material = new CANNON.Material({ restitution: 1 }); // reflect the force it recieved
  const body = new CANNON.Body({
    mass: 0, // static
    material: material,
  });
  body.addShape(shape);
  body.position.copy(position);
  world.addBody(body);

  const geometry = new THREE.BoxGeometry(width, 2, depth);
  const meshMaterial = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, meshMaterial);

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
