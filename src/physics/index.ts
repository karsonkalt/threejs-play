import * as CANNON from "cannon-es";
import * as THREE from "three";

export const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Adjust gravity as needed
world.broadphase = new CANNON.NaiveBroadphase();

export function toCanonVec3(v: THREE.Vector3) {
  return new CANNON.Vec3(v.x, v.y, v.z);
}

export function createPaddlePhysicsBody(position: CANNON.Vec3) {
  const shape = new CANNON.Cylinder(0.5, 0.5, 0.6, 16); // Slightly increased height
  const body = new CANNON.Body({ mass: 50 }); // Set mass to 5 for better interaction
  body.addShape(shape);
  body.position.copy(position);
  body.fixedRotation = false; // Allow rotation, but we will lock it using constraints
  body.quaternion.setFromEuler(0, 0, 0); // Ensure the cylinder is upright
  body.material = new CANNON.Material({ friction: 1.0, restitution: 0.1 }); // Adjust material for less bounciness
  body.angularDamping = 1; // Increased angular damping to reduce spins
  return body;
}

export function createPuckPhysicsBody(position: CANNON.Vec3) {
  const shape = new CANNON.Cylinder(0.4, 0.4, 0.25, 16);
  const body = new CANNON.Body({ mass: 1 }); // Increased mass
  body.addShape(shape);
  body.position.copy(position);
  body.quaternion.setFromEuler(0, Math.PI / 2, 0); // Align the cylinder upright
  body.linearDamping = 0.0;
  body.material = new CANNON.Material({ friction: 0.5, restitution: 0.0 }); // High restitution for bounciness
  body.angularDamping = 1; // Increased angular damping to reduce spins
  return body;
}

export function addGroundPlane(world: CANNON.World) {
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to be horizontal
  groundBody.material = new CANNON.Material({
    friction: 0.0,
    restitution: 0.2,
  }); // High restitution for bounciness
  world.addBody(groundBody);
}

interface WallOptions {
  width: number;
  depth: number;
  wallHeight: number;
  wallThickness: number;
}

export function addEnclosedArea(
  world: CANNON.World,
  options: WallOptions
): void {
  const { width, depth, wallHeight, wallThickness } = options;
  const halfExtentsX = width / 2;
  const halfExtentsZ = depth / 2;

  const positions = [
    { x: 0, y: wallHeight / 2, z: halfExtentsZ }, // front wall
    { x: 0, y: wallHeight / 2, z: -halfExtentsZ }, // back wall
    { x: halfExtentsX, y: wallHeight / 2, z: 0 }, // right wall
    { x: -halfExtentsX, y: wallHeight / 2, z: 0 }, // left wall
  ];

  const sizes = [
    { x: width, y: wallHeight, z: wallThickness }, // front and back walls
    { x: wallThickness, y: wallHeight, z: depth }, // left and right walls
  ];

  positions.forEach((position, index) => {
    const size = index < 2 ? sizes[0] : sizes[1];
    const wallShape = new CANNON.Box(
      new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
    );
    const wallBody = new CANNON.Body({
      mass: 0, // Static wall
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: wallShape,
    });
    world.addBody(wallBody);
  });
}
